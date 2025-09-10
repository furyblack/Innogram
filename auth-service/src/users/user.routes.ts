import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
  UserController.register
);
router.post("/login", UserController.login);

router.get("/me", authMiddleware, UserController.getMe);

export default router;
