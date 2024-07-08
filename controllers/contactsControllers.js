import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact } from '../services/contactsServices.js';
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import mongoose from 'mongoose';

const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw HttpError(400, 'Invalid ID format');
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    validateObjectId(id);
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    validateObjectId(id);
    const contact = await removeContact(id);
    if (!contact) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json({ message: 'Contact successfully deleted', contact });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
  
    const { error } = updateContactSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
  
    const result = await updateContactById(id, body);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateFavoriteStatus = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    validateObjectId(contactId);

    const { favorite } = req.body;
    if (favorite === undefined) {
      throw HttpError(400, "Missing field 'favorite'");
    }

    const result = await updateStatusContact(contactId, { favorite });
    if (!result) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};
