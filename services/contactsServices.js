import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const contactsPath = path.join(path.resolve(), 'contacts.json');

const listContacts = async () => {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Unable to read contacts file');
    }
};

const getContactById = async (contactId) => {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId) || null;
};

const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
        const removedContact = contacts.splice(index, 1)[0];
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return removedContact;
    }
    return null;
};

const addContact = async (name, email, phone) => {
    const newContact = { id: uuidv4(), name, email, phone };
    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
};

const updateContact = async (contactId, updateFields) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
        const updatedContact = { ...contacts[index], ...updateFields };
        contacts[index] = updatedContact;
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updatedContact;
    }
    return null;
};

export {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact
};
