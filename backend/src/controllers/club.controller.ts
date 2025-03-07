import { Request, Response } from 'express';
import * as clubService from '../services/club.service';

// Club Controllers
export async function createClubHandler(req: Request, res: Response) {
    try {
        const club = await clubService.createClub(req.body);
        return res.status(201).json(club);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Club name already exists' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getAllClubsHandler(req: Request, res: Response) {
    try {
        const clubs = await clubService.getAllClubs();
        return res.status(200).json(clubs);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getClubByIdHandler(req: Request, res: Response) {
    try {
        const club = await clubService.getClubById(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        return res.status(200).json(club);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateClubHandler(req: Request, res: Response) {
    try {
        const club = await clubService.updateClub(req.params.id, req.body);
        return res.status(200).json(club);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Club name already exists' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteClubHandler(req: Request, res: Response) {
    try {
        await clubService.deleteClub(req.params.id);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Club not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

// Club Event Controllers
export async function createClubEventHandler(req: Request, res: Response) {
    try {
        const event = await clubService.createClubEvent(req.params.clubId, req.body);
        return res.status(201).json(event);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Club not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getClubEventsHandler(req: Request, res: Response) {
    try {
        const events = await clubService.getClubEvents(req.params.clubId);
        return res.status(200).json(events);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateClubEventHandler(req: Request, res: Response) {
    try {
        const event = await clubService.updateClubEvent(req.params.eventId, req.body);
        return res.status(200).json(event);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteClubEventHandler(req: Request, res: Response) {
    try {
        await clubService.deleteClubEvent(req.params.eventId);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

// Club Member Controllers
export async function addClubMemberHandler(req: Request, res: Response) {
    try {
        const member = await clubService.addMemberToClub(req.params.clubId, req.body.userId);
        return res.status(201).json(member);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'User is already a member of this club' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Club or user not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function removeClubMemberHandler(req: Request, res: Response) {
    try {
        await clubService.removeMemberFromClub(req.params.clubId, req.params.userId);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Member not found in club' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getClubMembersHandler(req: Request, res: Response) {
    try {
        const members = await clubService.getClubMembers(req.params.clubId);
        return res.status(200).json(members);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

// Club Event User Controllers
export async function joinClubEventHandler(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { eventId } = req.params;

        // Check if user already joined
        const isJoined = await clubService.isUserJoinedEvent(req.user.id, eventId);
        if (isJoined) {
            return res.status(400).json({ message: 'You have already joined this event' });
        }

        const participation = await clubService.joinClubEvent(req.user.id, eventId);
        return res.status(201).json(participation);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Already joined this event' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function leaveClubEventHandler(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { eventId } = req.params;
        await clubService.leaveClubEvent(req.user.id, eventId);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Event participation not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getEventParticipantsHandler(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const participants = await clubService.getEventParticipants(eventId);
        return res.status(200).json(participants);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
} 