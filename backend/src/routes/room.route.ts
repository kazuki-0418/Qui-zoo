import express from "express";
import { roomController } from "../controllers/room.controller";

const router = express.Router();

// TODO All routes require authentication

// Quiz routes
router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/validate/:room_code", roomController.validateRoomCode);

export default router;
