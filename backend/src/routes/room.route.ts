import express from "express";
import { roomController } from "../controllers/room.controller";

const router = express.Router();

// TODO All routes require authentication

// Room routes
router.post("/", roomController.createRoom);

export default router;
