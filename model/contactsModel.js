import mongoose from 'mongoose';

const connectionUrl = 'mongodb+srv://alice:alice14@mydb.c7tevtt.mongodb.net/contacts-db';

mongoose.connect(connectionUrl).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, { versionKey: false }); 

export const Contact = mongoose.model('Contact', contactSchema);
