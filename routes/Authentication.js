const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router();
const JWT_SECRET = process.env.SECRET;

router.post('/register', async (req,res)=>{
    console.log('Received');
    
    const {username,password,name} = req.body;
    const existingUser = await User.findOne({username})
    if (existingUser) return res.status(400).json({message:'User with name already exist!'});

    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({username,password:hashedPassword,name});
    await user.save()

    res.json({message:'User registered successfully'});
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(403).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5h' });
    res.json({ message: 'Login Successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router