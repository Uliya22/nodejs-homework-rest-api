const { register, login, logout, current } = require("../servise/authServise");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

async function registrationController(req, res) {
  const { email, password } = req.body;
  const savedUser = await register(email, password);

  return res.status(201).json({
    user: {
      email: savedUser.email,
      password: savedUser.password,
      subscription: savedUser.subscription,
    },
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const storedUser = await login({ email, password });
  const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
    expiresIn: "1h",
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
        subscription: user.subscription
      }
    })
  }
  next();
}

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentController
};