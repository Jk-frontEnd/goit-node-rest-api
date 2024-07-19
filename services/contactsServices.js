import Contact from '../model/contactsModel.js';

// List all contacts for a specific user
export async function listContacts(userId) {
  return Contact.find({ owner: userId }).exec(); // Filter contacts by user ID
}

// Get a specific contact by ID for a specific user
export async function getContactById(contactId, userId) {
  return Contact.findOne({ _id: contactId, owner: userId }).exec(); // Filter by user ID
}

// Remove a specific contact by ID for a specific user
export async function removeContact(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId }).exec(); // Filter by user ID
}

// Add a new contact for a specific user
export async function addContact(name, email, phone, userId) {
  const newContact = new Contact({ name, email, phone, owner: userId }); // Associate contact with the user
  return newContact.save();
}

// Update a specific contact by ID for a specific user
export async function updateContactById(contactId, body, userId) {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId }, // Filter by user ID
    body,
    { new: true }
  ).exec();
}

// Update the favorite status of a specific contact by ID for a specific user
export async function updateStatusContact(contactId, body, userId) {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId }, // Filter by user ID
    { favorite: body.favorite },
    { new: true }
  ).exec();
}
