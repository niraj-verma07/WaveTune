import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as validationRules from "../middlewares/validation.middleware.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/register",
  validationRules.registerValidationRules,
  authController.register,
);

router.post(
  "/login",
  validationRules.loginUserValidationRules,
  authController.login,
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback route that Google will redirect to after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleAuthCallback,
);

export default router;
