import { body, param } from "express-validator";

export const registerValidation = [
  body("fullName")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("birthDate")
    .isISO8601()
    .withMessage("Birth date must be in YYYY-MM-DD format"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];
