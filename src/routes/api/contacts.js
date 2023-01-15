const express = require("express");
const {
  getContacts,
  getContact,
  deleteContact,
  createContact,
  updatedContact,
  changeStatus
} = require("../../controllers/contacts.controller");
const {
  postContactValidation,
  putContactValidation,
} = require("../../middlewares/validation");
const router = express.Router();
const { tryCatchWrapper } = require("../../helpers/error");

router.get("/", tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContact));
router.post("/", postContactValidation, tryCatchWrapper(createContact));
router.delete("/:contactId", tryCatchWrapper(deleteContact));
router.put(
  "/:contactId",
  putContactValidation,
  tryCatchWrapper(updatedContact)
);
router.patch("/:contactId/favorite", tryCatchWrapper(changeStatus));

module.exports = router;