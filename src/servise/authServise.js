const gravatar = require('gravatar');
const Jimp = require('jimp');
const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const { RepetParametersError, Unauthorized } = require('../helpers/error');
const fs = require('fs/promises');
const path = require('path');

async function register(email, password) {
  if (await User.findOne({ email }))
    next(new RepetParametersError('Email in use!'));

  const url = gravatar.url(email, {
    s:'250', d: 'mp'
})
  const user = await User.create({ email, password, avatarURL: url });
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    next(new Unauthorized('Email or password is wrong'));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(new Unauthorized('Email or password is wrong'));
  }

  return user;
}

async function logout(id) {
  const user = await User.findById(id);

  if (!user) {
    next(new Unauthorized('Not authorized'));
  }
  return user;
}

async function current(id) {
  const user = await User.findById(id);

  if (!user) {
    next(new Unauthorized('Not authorized'));
  }
  return user;
}

async function updateSubscription(id, subscription) {
const user = await User.findByIdAndUpdate(
  id,
  {
    $set: { subscription: subscription },
  },
  { new: true }
);
  return user;
}

async function avatarService(filePath, filename, userId) {
  const avatarUrl = `/avatars/${filename}`;
  const newPath = path.resolve('public/avatars', filename);

  const avatar = await Jimp.read(filePath);
  await avatar.resize(250, 250).quality(60).write(`./public/avatars/${filename}`);

  try {
    await fs.rename(filePath, newPath);
    await User.findByIdAndUpdate(userId, { $set: { avatarURL: avatarUrl } });
  
  } catch (error) {
    await fs.unlink(filePath);
    console.error(error);
  }
  return avatarUrl;
}

module.exports = {
  register,
  login,
  logout,
  current,
  updateSubscription,
  avatarService,
};
