const express = require('express');
const authRouter = express.Router();
const {
  registrationController,
  verifyController,
  verifyRecendEmailController,
  loginController,
  logoutController,
  currentController,
  subscriptionController,
  avatarController,
} = require('../../controllers/authController');
const { postUserValidation, subscriptionValidation, verifyEmailValidation } = require('../../middlewares/userValidation');
const { authAutorised } = require('../../middlewares/authMiddleware');
const { uploadMiddleware } = require('../../middlewares/avatarMiddleware');
const { tryCatchWrapper } = require('../../helpers/error');

authRouter.post('/register', postUserValidation, tryCatchWrapper(registrationController));
authRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyController));
authRouter.post('/verify', verifyEmailValidation, tryCatchWrapper(verifyRecendEmailController));

authRouter.post('/login', postUserValidation, tryCatchWrapper(loginController));
authRouter.post('/logout/:userId', authAutorised, tryCatchWrapper(logoutController));

authRouter.get('/current', authAutorised, tryCatchWrapper(currentController));
authRouter.patch('/', authAutorised, subscriptionValidation, tryCatchWrapper(subscriptionController));
authRouter.patch('/avatars', authAutorised, uploadMiddleware.single('avatar'), tryCatchWrapper(avatarController));

module.exports = { authRouter };
