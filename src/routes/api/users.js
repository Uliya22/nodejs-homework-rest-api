const express = require("express");
const authRouter = express.Router();
const {
  registrationController,
  loginController,
  logoutController,
  currentController
} = require("../../controllers/authController");
const { postUserValidation} = require("../../middlewares/postValidation");
const { authAutorised } = require("../../middlewares/authMiddleware");
const { tryCatchWrapper } = require("../../helpers/error");

authRouter.post("/register", postUserValidation, tryCatchWrapper(registrationController));
authRouter.post("/login", postUserValidation, tryCatchWrapper(loginController));

authRouter.post("/logout/:userId", authAutorised, tryCatchWrapper(logoutController));
authRouter.get( "/current", authAutorised, tryCatchWrapper(currentController));

module.exports = { authRouter };
