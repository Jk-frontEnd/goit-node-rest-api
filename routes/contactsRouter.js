import express from "express";
<<<<<<< Updated upstream
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
=======
import { 
  getAllContacts, 
  getOneContact, 
  deleteContact, 
  createContact, 
  updateContact, 
  updateFavoriteStatus, 
  validateCreateContact, 
  validateUpdateContact } from '../controllers/contactsControllers.js';
>>>>>>> Stashed changes

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

contactsRouter.patch('/:id/favorite', updateFavoriteStatus);

export default contactsRouter;