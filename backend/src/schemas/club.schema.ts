import { z } from 'zod';

// Club Schemas
export const createClubSchema = z.object({
    body: z.object({
        clubName: z.string().min(2, 'Club name must be at least 2 characters'),
        clubInfo: z.string().min(10, 'Club info must be at least 10 characters'),
        clubGoals: z.string().min(10, 'Club goals must be at least 10 characters'),
    }),
});

export const updateClubSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        clubName: z.string().min(2, 'Club name must be at least 2 characters').optional(),
        clubInfo: z.string().min(10, 'Club info must be at least 10 characters').optional(),
        clubGoals: z.string().min(10, 'Club goals must be at least 10 characters').optional(),
    }),
});

// Club Event Schemas
export const createClubEventSchema = z.object({
    params: z.object({
        clubId: z.string(),
    }),
    body: z.object({
        eventName: z.string().min(2, 'Event name must be at least 2 characters'),
        eventDate: z.string().transform((str) => new Date(str)),
        eventVenue: z.string().min(2, 'Venue must be at least 2 characters'),
        eventInfo: z.string().min(10, 'Event info must be at least 10 characters'),
        eventPoster: z.string().url('Invalid poster URL'),
    }),
});

export const updateClubEventSchema = z.object({
    params: z.object({
        clubId: z.string(),
        eventId: z.string(),
    }),
    body: z.object({
        eventName: z.string().min(2, 'Event name must be at least 2 characters').optional(),
        eventDate: z.string().transform((str) => new Date(str)).optional(),
        eventVenue: z.string().min(2, 'Venue must be at least 2 characters').optional(),
        eventInfo: z.string().min(10, 'Event info must be at least 10 characters').optional(),
        eventPoster: z.string().url('Invalid poster URL').optional(),
    }),
});

// Club Event User Schema
export const joinClubEventSchema = z.object({
    params: z.object({
        eventId: z.string(),
    }),
});

// Club Member Management Schemas
export const addClubMemberSchema = z.object({
    params: z.object({
        clubId: z.string(),
    }),
    body: z.object({
        userId: z.string(),
    }),
});

// Types for service layer
export type CreateClubInput = {
    clubName: string;
    clubInfo: string;
    clubGoals: string;
};

export type UpdateClubInput = Partial<CreateClubInput>;
export type CreateClubEventInput = z.infer<typeof createClubEventSchema>['body'];
export type UpdateClubEventInput = z.infer<typeof updateClubEventSchema>['body'];
export type JoinClubEventInput = z.infer<typeof joinClubEventSchema>['params']; 