const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
} = require("../servise/contactsService");
const { WrongParametersError } = require("../helpers/error");

async function getContacts(req, res, next) {
  const { _id } = req.user;

   let { page = 1, limit = 5 } = req.query;
   const skip = (page - 1) * limit;
  limit = parseInt(limit) > 10 ? 10 : parseInt(limit);
  
  const contacts = await listContacts(_id, {skip, limit});
  return res.json({contacts, skip, limit});
}

async function getContact(req, res, next) {
  const id = req.params.contactId;
  const { _id } = req.user;
  const contact = await getContactById(id, _id);
  if (!contact) {
    next (new WrongParametersError(`Contact with id ${id} is not found`));
   
  }

  return res.json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const { _id } = req.user;
  const newContact = await addContact({ name, email, phone }, { owner: _id });
  res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const id = req.params.contactId;
  const { _id } = req.user;
  const deletedContact = await removeContact(id, _id);

  if (!deletedContact) {
    next (new WrongParametersError(`Contact with id ${id} is not found`));
  }

  return res.status(200).json({ message: `Contact with id ${id} is deleted` });
}

async function updatedContact(req, res, next) {
  const id = req.params.contactId;
  const { _id } = req.user;
  const { name, email, phone } = req.body;
  const response = await updateContact(id, _id, { name, email, phone });

  if (response) {
    return res.json(response);
  }
  next (new WrongParametersError(`Contact with id=${id} not found! `));
}

async function changeStatus(req, res, next) {
  const id = req.params.contactId;
  const { _id } = req.user;
  const { favorite } = req.body;
  const response = await updateStatusContact(id, _id, { favorite });

  
  if (response) {
    return res.json(response);
  }
  next (new WrongParametersError(`Contact with id=${id} not found! `));
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updatedContact,
  changeStatus,
};