const express = require('express');
const {
  getContacts,
  getContact,
  deleteContact,
  createContact,
  updatedContact,
  changeStatus,
} = require('../../controllers/contacts.controller');
const { authAutorised } = require('../../middlewares/authMiddleware');
const { postContactValidation } = require('../../middlewares/contactValidation');
const { putContactValidation } = require('../../middlewares/contactValidation');
const router = express.Router();
const { tryCatchWrapper } = require('../../helpers/error');

router.use(authAutorised);

router.get('/', tryCatchWrapper(getContacts));
router.get('/:contactId', tryCatchWrapper(getContact));
router.post('/', postContactValidation, tryCatchWrapper(createContact));
router.delete('/:contactId', tryCatchWrapper(deleteContact));
router.put(
  '/:contactId',
  putContactValidation,
  tryCatchWrapper(updatedContact)
);
router.patch('/:contactId/favorite', tryCatchWrapper(changeStatus));

module.exports = { contactsRouter: router };
