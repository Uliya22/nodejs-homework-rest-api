const gravatar = require('gravatar');
const Jimp = require('jimp');
const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const {
  RepetParametersError,
  Unauthorized,
  RequestError,
  WrongParametersError,
  NotverificatiomEmail,
} = require('../helpers/error');
const sendEmail = require('../helpers/sendEmail');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function register({email, password}) {
  if (await User.findOne({ email })) {
    throw new RepetParametersError('Email in use!');
  };  

  const url = gravatar.url(email, {
    s:'250', d: 'mp'
  })

  const verificationToken = uuidv4();
  const user = await User.create({ email, password, avatarURL: url, verificationToken });

  const msg = {
    to: email,
    subject: 'Підтвердження реєстрації на сайті',
    text: 'Натисніть для підтвердження email',
    html: `<a href='http://localhost:3000/api/users/verify/${verificationToken}' target='_blank'>Натисніть для підтвердження email</a>`,
  };
  await sendEmail(msg);

  return user;
}

async function verifyEmail({verificationToken}) {
  
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new RequestError('User not found');
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
  return user;
}

async function verifyRecendEmail({email}) {
  const user = await User.findOne({ email });

if (!email) {
  throw new WrongParametersError('Missing required field email');
}

  if (!user) {
    throw new RequestError('User not found');
  }
  if (user.verify) {
    throw new WrongParametersError('Verification has already been passed');
  }

  const msg = {
    to: email,
    subject: 'Підтвердження реєстрації на сайті',
    text: 'Натисніть для підтвердження email',
    html: `<a href='http://localhost:3000/api/users/verify/${user.verificationToken}' target='_blank'>Натисніть для підтвердження email</a>`,
  };
  await sendEmail(msg);
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized('Email or password is wrong');
  }

  if (!user.verify) {
    throw new NotverificatiomEmail('Email is not verify')
  }

  return user;
}

async function logout(id) {
  const user = await User.findById(id);

  if (!user) {
    throw new Unauthorized('Not authorized');
  }
  return user;
}

async function current(id) {
  const user = await User.findById(id);

  if (!user) {
    throw new Unauthorized('Not authorized');
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
  verifyEmail,
  verifyRecendEmail,
  login,
  logout,
  current,
  updateSubscription,
  avatarService,
};
