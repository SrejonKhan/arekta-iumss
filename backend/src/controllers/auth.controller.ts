import httpStatus from "http-status";
import {
  changePasswordSchema,
  googleOAuth2SignInSchema,
  redeemChangePasswordSchema,
  refreshAccessTokenSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/auth.schema";
import {
  exchangeAccessToken,
  findUserByEmail,
  handleChangePassword,
  handleGetUserClubRecommendations,
  handleGetUsersByRole,
  handleGoogleSignIn,
  handleRedeemChangePassword,
  handleUserSignIn,
  handleUserSignUp,
} from "../services/auth.service";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import { excludeFromObject } from "../utils/object";
import { sendToExchange } from "../lib/amqp";
import { Role } from "@prisma/client";

const signIn = async (req, res, next) => {
  try {
    const payload = signInSchema.parse(req.body);
    const { email, password } = payload;
    const { user, token } = await handleUserSignIn(email, password);

    logger.info(`UserID ${user.id} signed in.`);

    const body = {
      message: "Successfully signed in!",
      user,
      token,
    };
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signUpSchema.parse(req.body);
    const { email, password, username, displayName } = payload;
    // const { user, token } = await handleUserSignUp(email, password, username, displayName);

    // logger.info(`New user created. UserID: ${user.id}.`);

    // const body = {
    //   message: "Successfully signed up!",
    //   user,
    //   token,
    // };
    // sendToExchange("exchange.mail", "user", user);
    // res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const whoami = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserByEmail(req.user.email);

    const body = {
      message: "You are somebody and you are really precious to us!",
      user: excludeFromObject(user, ["passwordHash"]),
    };
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = changePasswordSchema.parse(req.body);
    const { email, username } = payload;

    const { maskedEmail } = await handleChangePassword(email, username, req.ip);

    logger.info(`Change Password requested for ${maskedEmail}.`);

    const body = {
      message: "Successfully sent Change Password Link to registered email address.",
      maskedEmail,
    };

    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const redeemChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = redeemChangePasswordSchema.parse(req.body);
    const { token, password } = payload;

    const { maskedEmail } = await handleRedeemChangePassword(token, password, req.ip);

    logger.info(`Change Password redeemed for ${maskedEmail}.`);

    const body = {
      message: "Successfully Changed Password.",
    };

    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = refreshAccessTokenSchema.parse(req.body);
    const { grantType, refreshToken } = payload;

    let accessToken = exchangeAccessToken(grantType, refreshToken);

    const body = {
      message: "Successfully exchanged token. New Access Token granted.",
      accessToken,
    };

    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const googleOAuth2SignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = googleOAuth2SignInSchema.parse(req.body);
    const { code } = payload;

    const { user, token } = await handleGoogleSignIn(code.trim());

    const body = {
      message: "Successfully signed up using Google!",
      user,
      token,
    };
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

// create a new controller create user from admin panel
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signUpSchema.parse(req.body);

    const {
      role,
      email,
      password,
      username,
      displayName,
      currentSemester,
      department,
      profileIntro,
      designation,
      avatarUrl,
      tenureStart,
      tenureEnd,
      clubGoals,
      levelTerm,
      currentCgpa,
      requiredCredit,
      completedCredit,
      ongoingCredit,
    } = payload;

    const { user, userProfile, token } = await handleUserSignUp(
      role,
      email,
      password,
      username,
      displayName,
      currentSemester,
      department,
      profileIntro,
      designation,
      avatarUrl,
      tenureStart,
      tenureEnd,
      clubGoals,
      levelTerm,
      currentCgpa,
      requiredCredit,
      completedCredit,
      ongoingCredit
    );

    logger.info(`New user created . UserID: ${user.id}.`);

    const body = {
      message: "Successfully signed up!",
      user,
      userProfile,
      token,
    };
    sendToExchange("exchange.mail", "user", user);
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;

    const users = await handleGetUsersByRole(role as Role);

    const body = {
      message: "Successfully fetched users by role!",
      users,
    };
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

const getUserClubRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    const recommendations = await handleGetUserClubRecommendations(userId as string);

    const body = {
      message: "Successfully fetched club recommendations!",
      recommendations,
    };
    res.status(httpStatus.OK).send(body);
  } catch (ex) {
    next(ex);
  }
};

export {
  signIn,
  signUp,
  whoami,
  changePassword,
  redeemChangePassword,
  refreshAccessToken,
  googleOAuth2SignIn,
  createUser,
  getUsersByRole,
  getUserClubRecommendations,
};
