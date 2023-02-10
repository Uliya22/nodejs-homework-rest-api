const { Contact } = require('../models/contactsModel');

async function listContacts(id, { skip, limit }, favorite) {
  if (!favorite) {
    const contact = await Contact.find({ owner: id }).skip(skip).limit(limit);
    return contact;
  }

const contact = await Contact.find({ owner: id, favorite: favorite }).skip(skip).limit(limit);
  return contact;
}

async function getContactById(_id, id) {
  const contact = await Contact.findById({ _id, owner: id });

  return contact;
}

async function addContact({ name, email, phone }, { owner: id }) {
  const savedContact = await Contact.create({ name, email, phone, owner: id });
  return savedContact;
}

async function removeContact(_id, id) {
  const contact = await Contact.findByIdAndRemove({ _id, owner: id });
  return contact;
}

async function updateContact(_id, id, { name, email, phone }) {
  const contact = await Contact.findByIdAndUpdate(
    { _id, owner: id },
    { ...{ name, email, phone } },
    { new: true }
  );
  return contact;
}

async function updateStatusContact(_id, id, { favorite }) {
  const contact = await Contact.findByIdAndUpdate(
    { _id, owner: id },
    { $set: { favorite } },
    {
      new: true,
    }
  );
  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
