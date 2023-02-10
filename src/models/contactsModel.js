const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false }
);

const Contact = model('contact', schema);

module.exports = {
  Contact,
};
