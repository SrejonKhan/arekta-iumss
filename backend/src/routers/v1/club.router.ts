import { Router } from "express";
import {
  createClubHandler,
  getAllClubsHandler,
  getClubByIdHandler,
  updateClubHandler,
  deleteClubHandler,
  createClubEventHandler,
  getClubEventsHandler,
  updateClubEventHandler,
  deleteClubEventHandler,
  addClubMemberHandler,
  removeClubMemberHandler,
  getClubMembersHandler,
  joinClubEventHandler,
  leaveClubEventHandler,
  getEventParticipantsHandler,
} from "../../controllers/club.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createClubSchema,
  updateClubSchema,
  createClubEventSchema,
  updateClubEventSchema,
  addClubMemberSchema,
  joinClubEventSchema,
} from "../../schemas/club.schema";
import { hasRole } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", getAllClubsHandler);
router.get("/:id", getClubByIdHandler);
router.get("/:clubId/events", getClubEventsHandler);
router.get("/:clubId/members", getClubMembersHandler);
router.get("/events/:eventId/participants", getEventParticipantsHandler);

// Protected routes - Admin only
router.use(hasRole([Role.ADMIN]));

// Club management
router.post("/", validateRequest(createClubSchema), createClubHandler);
router.patch("/:id", validateRequest(updateClubSchema), updateClubHandler);
router.delete("/:id", deleteClubHandler);

// Club events management
router.post("/:clubId/events", validateRequest(createClubEventSchema), createClubEventHandler);
router.patch("/:clubId/events/:eventId", validateRequest(updateClubEventSchema), updateClubEventHandler);
router.delete("/:clubId/events/:eventId", deleteClubEventHandler);

// Club members management
router.post("/:clubId/members", validateRequest(addClubMemberSchema), addClubMemberHandler);
router.delete("/:clubId/members/:userId", removeClubMemberHandler);

// Event participation (requires authentication)
router.post("/events/:eventId/join", validateRequest(joinClubEventSchema), joinClubEventHandler);
router.delete("/events/:eventId/leave", leaveClubEventHandler);

export default router;
