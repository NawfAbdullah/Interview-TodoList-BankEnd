const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router();
const JWT_SECRET = 'secretkey';

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


router.post('/login',async (req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if (!user) return res.status(400).json({message:"User doesn't exist!"})

    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) return res.status(403).json({message:"Invalid credentials"})

    const token = jwt.sign({ userId:user._id},JWT_SECRET)
    res.json({message:'Login Successful', token})
})

module.exports = router