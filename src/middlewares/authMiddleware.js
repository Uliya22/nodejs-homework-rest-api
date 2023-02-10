const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../helpers/error');
const { User } = require('../models/userModel');

async function authAutorised(req, res, next) {
  const [type, token] = req.headers.authorization.split(' ');

  if (type !== 'Bearer') {
    next(new Unauthorized('Not authorized'));
  }

  if (!token) {
    next(new Unauthorized('Not authorized'));
  }

  try {
    const { id } = await jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      next(new Unauthorized('Not authorized. User is not found.'));
    }
    req.user = user;
    req.token = token;
  } catch (error) {
    next(new Unauthorized('Not authorized'));
  }

  next();
}

module.exports = {
  authAutorised,
};
