import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact } from '../services/contactsServices.js';
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await removeContact(id);
    res.status(204).json();
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
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
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
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
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
};

export const updateFavoriteStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const result = await updateStatusContact(contactId, { favorite });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
};