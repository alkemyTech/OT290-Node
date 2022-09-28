const { Contact } = require("../models");
const { validationResult } = require("express-validator");

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.send(contacts);
  } catch (error) {
    res.send(error);
  }
};

const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.sendStatus(404);
    }
    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createContact = async (req, res) => {
  // try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, phone, message } = req.body;
  const contact = await Contact.create({
    name,
    phone,
    email,
    message,
  });

  return { contact };
};

const updateContact = async (req, res) => {
  // try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, phone, message } = req.body;
  const contact = await Contact.update({
    name,
    phone,
    email,
    message,
  });

  return { contact };
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
};
