import mongoose from 'mongoose';

const connectionUrl = 'mongodb+srv://alice:alice14@mydb.c7tevtt.mongodb.net/';

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

export const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  phone: String,
  favorite: Boolean
});