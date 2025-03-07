import { PrismaClient, Prisma } from '@prisma/client';
import { CreateClubInput, UpdateClubInput, CreateClubEventInput, UpdateClubEventInput } from '../schemas/club.schema';

const prisma = new PrismaClient();

// Club Services
export async function createClub(input: CreateClubInput) {
    const { clubName, clubInfo, clubGoals } = input;
    return prisma.club.create({
        data: {
            clubName,
            clubInfo,
            clubGoals,
        },
        include: {
            clubEvents: true,
            clubMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getAllClubs() {
    return prisma.club.findMany({
        include: {
            clubEvents: true,
            clubMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getClubById(id: string) {
    return prisma.club.findUnique({
        where: { id },
        include: {
            clubEvents: true,
            clubMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
}

export async function updateClub(id: string, input: UpdateClubInput) {
    return prisma.club.update({
        where: { id },
        data: input,
        include: {
            clubEvents: true,
            clubMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                        },
                    },
                },
            },
        },
    });
}

export async function deleteClub(id: string) {
    return prisma.club.delete({
        where: { id },
    });
}

// Club Event Services
export async function createClubEvent(clubId: string, input: CreateClubEventInput) {
    const { eventName, eventDate, eventVenue, eventInfo, eventPoster } = input;
    return prisma.clubEvent.create({
        data: {
            eventName,
            eventDate,
            eventVenue,
            eventInfo,
            eventPoster,
            club: {
                connect: { id: clubId }
            }
        },
    });
}

export async function getClubEvents(clubId: string) {
    return prisma.clubEvent.findMany({
        where: { clubId },
    });
}

export async function updateClubEvent(eventId: string, input: UpdateClubEventInput) {
    return prisma.clubEvent.update({
        where: { id: eventId },
        data: input,
    });
}

export async function deleteClubEvent(eventId: string) {
    return prisma.clubEvent.delete({
        where: { id: eventId },
    });
}

// Club Member Services
export async function addMemberToClub(clubId: string, userId: string) {
    return prisma.userClub.create({
        data: {
            clubId,
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    });
}

export async function removeMemberFromClub(clubId: string, userId: string) {
    return prisma.userClub.delete({
        where: {
            userId_clubId: {
                userId,
                clubId,
            },
        },
    });
}

export async function getClubMembers(clubId: string) {
    return prisma.userClub.findMany({
        where: { clubId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    });
} 