<<<<<<< Updated upstream
import contactsService from "../services/contactsServices.js";
=======
import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact } from '../services/contactsServices.js';
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
>>>>>>> Stashed changes

export const getAllContacts = (req, res) => {};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

<<<<<<< Updated upstream
export const updateContact = (req, res) => {};
=======
export const createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
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
>>>>>>> Stashed changes
