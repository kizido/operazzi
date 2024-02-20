import express from "express";
import * as UserController from "../controllers/usersController";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/verify-email", UserController.verifyEmail);

export default router;