const { register,  login, logout, current, updateSubscription, avatarService, verifyEmail, verifyRecendEmail } = require('../servise/authServise');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

async function registrationController(req, res) {
  const { email, password } = req.body;
  const savedUser = await register({email, password});

  return res.status(201).json({
    user: {
      email: savedUser.email,
      password: savedUser.password,
      subscription: savedUser.subscription,
      avatarURL: savedUser.avatarURL,
    },
  });
}

async function verifyController(req, res) {
  const { verificationToken } = req.params;
  const savedUser = await verifyEmail({ verificationToken });
  
    return res.status(200).json({
      message: `Email ${savedUser.email} verification successful`,
    });
}

async function verifyRecendEmailController(req, res) {
  const { email } = req.body;
  const savedUser = await verifyRecendEmail({ email });

  return res.status(200).json({
    message: `Email ${savedUser.email} verification successful`,
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const storedUser = await login({ email, password });
  const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    token: token,
    user: {
      email: storedUser.email,
      subscription: storedUser.subscription,
    },
  });
}

async function logoutController(req, res, next) {
  let token = req.token;
  const { userId } = req.params;
  const user = await logout(userId, token);
  token = null;

  if (user) {
    return res.status(204).json();
  }
  next();
}

async function currentController(req, res, next) {
  const { _id } = req.user;
  const user = await current(_id);
  if (user) {
    return res.status(200).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  }
  next();
}

async function subscriptionController(req, res, next) {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await updateSubscription(_id, subscription);
  return res.status(200).json(user);
}

async function avatarController(req, res, next) {
  const { _id } = req.user;
  const { path, filename } = req.file;
  const url = await avatarService(path, filename, _id);
  res.json({ avatarURL: url });
}
module.exports = {
  registrationController,
  verifyController,
  verifyRecendEmailController,
  loginController,
  logoutController,
  currentController,
  subscriptionController,
  avatarController,
};
