const { User } = require("../models/userModel");
const  bcrypt  = require("bcrypt");
const {
  NotAuthorizedError,
  RepetParametersError,
  Unauthorized,
} = require("../helpers/error");

async function register(email, password) {
  if (await User.findOne({ email }))
    next(new RepetParametersError("Email in use!"));
  
  const user = await User.create({ email, password });

  return user;
};

async function login({ email, password }) {

  const user = await User.findOne({
    email,
  });

  if (!user) {
    next(new NotAuthorizedError("Email or password is wrong"));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(new NotAuthorizedError("Email or password is wrong"));
  }
  
  return user;
}

async function logout(id) {
  const user = await User.findById(id);

  if (!user) {
    next(new Unauthorized("Not authorized"));
  }
  return user;
}

async function current(id) {
  const user = await User.findById(id);

  if (!user) {
    next(new Unauthorized("Not authorized"));
  }
  return user;
}

module.exports = {
  register,
  login,
  logout,
  current
};
