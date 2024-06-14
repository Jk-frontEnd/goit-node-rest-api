import { listContacts, getContactById, removeContact, addContact, updateContact as serviceUpdateContact } from '../services/contactsService.js';
import { contactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';

export const updateContact = async (req, res) => {
    const contactId = req.params.id;
    const { error, value } = updateContactSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const updatedContact = await serviceUpdateContact(contactId, value);

        if (updatedContact) {
            res.status(200).json(updatedContact);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOneContact = async (req, res) => {
    const contactId = req.params.id;

    try {
        const contact = await getContactById(contactId);

        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteContact = async (req, res) => {
    const contactId = req.params.id;

    try {
        const removedContact = await removeContact(contactId);

        if (removedContact) {
            res.status(200).json(removedContact);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createContact = async (req, res) => {
    const { error, value } = contactSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const newContact = await addContact(value.name, value.email, value.phone);
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

