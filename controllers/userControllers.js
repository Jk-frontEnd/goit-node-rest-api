import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import fs from 'fs/promises'; 
import path from 'path';
import jimp from 'jimp';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
import nodemailer from 'nodemailer'; 
import HttpError from "../helpers/HttpError.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ 
      user: {
        email: user.email,
        subscription: user.subscription,
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Missing required field' });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Email in use." });
    }

    res.status(500).json({ message: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: `Missing required ${!email ? 'email' : 'password'} field` });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatar = await jimp.read(file.path);
    await avatar.resize(250, 250);
    
    const avatarDir = path.join(__dirname, '../public/avatars');
    const avatarFilename = `${req.user.id}-${Date.now()}.jpg`;
    const finalAvatarPath = path.join(avatarDir, avatarFilename);
    
    await fs.mkdir(avatarDir, { recursive: true });
    await avatar.writeAsync(finalAvatarPath);
    await fs.unlink(file.path);

    const avatarURL = `/avatars/${avatarFilename}`;
    await User.findByIdAndUpdate(req.user.id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendVerificationEmail = async (user) => {
  const verificationToken = nanoid();
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `http://yourdomain.com/users/verify/${verificationToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: 'process.env.EMAIL_USER',
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyAgain = async(req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing required field email' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }

  sendVerificationEmail(user);
  res.status(200).json({ message: 'Verification email sent' });
}

export { verifyAgain, verifyEmail, register, loginUser, logoutUser, getCurrentUser, updateAvatar };
