import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/error";
import config from "../config/base.config";
import jwt from "jsonwebtoken";
import { User, Role } from "@prisma/client";
import { excludeFromObject } from "../utils/object";
import { generateUserNameFromEmail, maskEmailAddress } from "../utils/string";
import httpStatus from "http-status";
import { sendToExchange } from "../lib/amqp";
import { randomBytes } from "crypto";
import logger from "../utils/logger";
import axios from "axios";
import { oauth2Client } from "../lib/google";
import { TokenPayload, TokenType } from "../interfaces/auth.interface";

const handleUserSignIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "User not found!");
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid Password!");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: excludeFromObject(user, ["passwordHash"]),
    token: {
      accessToken,
      refreshToken,
    },
  };
};
const handleUserSignUp = async (
  role: Role,
  email: string,
  password: string,
  username: string,
  displayName?: string,
  currentSemester?: string,
  department?: string,
  profileIntro?: string,
  designation?: string,
  avatarUrl?: string,
  tenureStart?: Date,
  tenureEnd?: Date,
  clubGoals?: string,
  levelTerm?: string,
  currentCgpa?: string,
  requiredCredit?: number,
  completedCredit?: number,
  ongoingCredit?: number
) => {
  const userWithEmail = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userWithEmail) {
    throw new ApiError(400, "User with same email already exist!");
  }

  const userWithUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  if (userWithUsername) {
    throw new ApiError(400, "User with same username already exist!");
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      displayName: displayName,
      passwordHash: passwordHash,
      role: role,
    },
  });

  const userProfile = await prisma.userProfile.create({
    data: {
      userId: user.id,
      currentSemester: currentSemester,
      department: department,
      profileIntro: profileIntro,
      designation: designation,
      avatarUrl: avatarUrl,
      tenureStart: tenureStart,
      tenureEnd: tenureEnd,
      clubGoals: clubGoals,
      levelTerm: levelTerm,
      currentCgpa: currentCgpa,
      requiredCredit: requiredCredit,
      completedCredit: completedCredit,
      ongoingCredit: ongoingCredit,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: excludeFromObject(user, ["passwordHash"]),
    userProfile,
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const generateAccessToken = (user: User) => {
  const payload: TokenPayload = {
    type: TokenType.refreshToken,
    jwtUser: excludeFromObject(user, ["passwordHash"]),
  };
  return jwt.sign(payload, config.RSA_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 60 * 60 });
};

const generateRefreshToken = (user: User) => {
  const payload: TokenPayload = {
    type: TokenType.refreshToken,
    jwtUser: excludeFromObject(user, ["passwordHash"]),
  };
  return jwt.sign(payload, config.RSA_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 60 * 60 });
};

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email: email },
  });
};

const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username: username },
  });
};

const handleChangePassword = async (email: string, username: string, ipAddress: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { username: username }] },
  });

  if (!user) {
    throw new ApiError(400, "User doesn't exist with the provided email/username!");
  }

  // make sure that no one is spamming or requesting too many change pass req.
  const tokens = await prisma.changePasswordRequest.findMany({
    where: {
      AND: [{ userId: user.id }],
    },
  });

  const currentTime = new Date().getTime();
  const FIFTEEN_MINS = 15 * 60 * 1000; /* ms */
  for (const token of tokens) {
    if (currentTime - token.requestedAt.getTime() < FIFTEEN_MINS) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "A change password is requested just a while ago and never redeemed. Wait for a moment before requesting again."
      );
    }
  }

  // create token
  const changePassToken = randomBytes(32).toString("hex");

  await prisma.changePasswordRequest.create({
    data: {
      reqIpAddress: ipAddress,
      token: changePassToken,
      userId: user.id,
    },
  });

  // send to exchange
  const exchangeContent = {
    email: user.email,
    changePassJwtToken: changePassToken,
    reqTime: Date.now(),
    reqIpAddress: ipAddress,
  };

  sendToExchange("exchange.mail", "change_pass", exchangeContent);

  return { maskedEmail: maskEmailAddress(user.email) };
};

const handleRedeemChangePassword = async (token: string, password: string, ipAddress: string) => {
  const changePassReq = await prisma.changePasswordRequest.findUnique({
    where: { token: token },
    include: {
      user: true,
    },
  });

  if (!changePassReq) {
    throw new ApiError(400, "No Change Password Request exist with the following token!");
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  // update
  await prisma.user.update({
    where: {
      email: changePassReq.user.email,
    },
    data: {
      passwordHash: passwordHash,
    },
  });

  await prisma.changePasswordRequest.delete({
    where: {
      token: token,
    },
  });

  const exchangeContent = {
    email: changePassReq.user.email,
    redeemTime: Date.now(),
    redeemIpAddress: ipAddress,
  };

  // send a confirmation mail to the user
  sendToExchange("exchange.mail", "change_pass_confirmation", exchangeContent);

  return { maskedEmail: maskEmailAddress(changePassReq.user.email) };
};

const exchangeAccessToken = async (grantType: string, refreshToken: string): Promise<string> => {
  const payload = jwt.verify(refreshToken, config.RSA_PUBLIC_KEY, { algorithms: ["RS256"] });
  const { type, jwtUser }: TokenPayload = JSON.parse(JSON.stringify(payload));

  if (type == TokenType.accessToken)
    throw new ApiError(httpStatus.BAD_REQUEST, "Expected Refresh Token but received Access Token");

  const user = await prisma.user.findUnique({
    where: { email: jwtUser.email },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User's critical info is updated since the refresh token is issued. Please re-authenticate."
    );
  }

  const accessToken = generateAccessToken(user);
  return accessToken;
};

const handleGoogleSignIn = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);

  const userResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  const googleUserData: {
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    name: string;
    picture: string;
    sub: string;
  } = userResponse.data;

  let user = await prisma.user.findUnique({
    where: { email: googleUserData.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUserData.email,
        username: generateUserNameFromEmail(googleUserData.email),
        displayName: googleUserData.name,
        passwordHash: "",
        authType: "OAUTH",
      },
    });
    logger.info(`New user created using Google OAuth. UserID: ${user.id}.`);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: excludeFromObject(user, ["passwordHash"]),
    token: {
      accessToken,
      refreshToken,
    },
  };
};

const handleGetUsersByRole = async (role: Role) => {
  return await prisma.user.findMany({
    where: {
      role: role,
    },
    include: {
      userProfile: true,
    },
  });
};

const handleGetUserClubRecommendations = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userProfile: true,
      ClubEventUser: true,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  const joinedEventsId = user.ClubEventUser.map((event) => event.clubEventId);
  const joinedEvents = await prisma.clubEvent.findMany({
    where: {
      id: {
        in: joinedEventsId,
      },
    },
  });

  const userDepartment = user.userProfile.department;
  const userCurrentSemester = user.userProfile.currentSemester;
  const userLevelTerm = user.userProfile.levelTerm;
  const userCurrentCgpa = user.userProfile.currentCgpa;
  const userRequiredCredit = user.userProfile.requiredCredit;
  const userCompletedCredit = user.userProfile.completedCredit;
  const userOngoingCredit = user.userProfile.ongoingCredit;
  const userProfileIntro = user.userProfile.profileIntro;
  const allClubs = await prisma.club.findMany();

  const aiRecommendations = await axios.post(
    "https://api.x.ai/v1/chat/completions",
    {
      messages: [
        {
          role: "system",
          content: `Here is a student. \
            Department: ${userDepartment}, 
            Semester: ${userCurrentSemester}, 
            Level Term: ${userLevelTerm}, 
            CGPA: ${userCurrentCgpa}, 
            Required Credit: ${userRequiredCredit}, 
            Completed Credit: ${userCompletedCredit}, 
            Ongoing Credit: ${userOngoingCredit}, 
            Profile Intro: ${userProfileIntro}.
            Has joined ${joinedEvents.length} events. 
            Events infos are: ${joinedEvents.map((event) => event.eventInfo).join(", ")}
            Here are the clubs: ${allClubs.map((club) => `${club.id} - ${club.clubName} - ${club.clubGoals} - ${club.clubInfo}`).join(", ")}. 
            What clubs should we recommend to this student?
            The response should be a list of clubs.`,
        },
      ],
      model: "grok-2-latest",
      stream: false,
      temperature: 0,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.XAI_API_KEY}`,
      },
    }
  );

  const recommendedClubs = aiRecommendations.data.choices[0].message;

  return recommendedClubs;
};

export {
  handleUserSignIn,
  handleUserSignUp,
  findUserByEmail,
  findUserByUsername,
  handleChangePassword,
  handleRedeemChangePassword,
  exchangeAccessToken,
  handleGoogleSignIn,
  handleGetUsersByRole,
  handleGetUserClubRecommendations,
};
