const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = {}; // { email: { username, password, verified, otp } }

// Configure your email here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',      // <-- replace with your email
    pass: 'YOUR_APP_PASSWORD'          // <-- replace with your app password (not your main password)
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ message: 'All fields required' });
  if (users[email]) return res.status(400).json({ message: 'Email already registered' });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  users[email] = { username, password, verified: false, otp };

  // Send OTP email
  try {
    await transporter.sendMail({
      from: '"Quiz App" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: 'Your Quiz App OTP',
      text: `Your OTP is: ${otp}`
    });
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    delete users[email];
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// OTP verification endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!users[email]) return res.status(400).json({ message: 'User not found' });
  if (users[email].otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  users[email].verified = true;
  delete users[email].otp;
  res.json({ message: 'Email verified! You can now login.' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = Object.values(users).find(u => u.username === username && u.password === password && u.verified);
  if (!user) return res.status(400).json({ message: 'Invalid credentials or email not verified' });
  res.json({ message: 'Login successful' });
});

app.listen(3000, () => console.log('Server running on http://192.168.1.5:3000'));