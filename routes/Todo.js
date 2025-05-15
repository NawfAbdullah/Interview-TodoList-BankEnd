const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('../middleware/auth');
const {v4:uuid} = require('uuid') 
const { mongoose } = require('mongoose');

router.get('/',auth,async (req,res)=>{
    const user_id = req.user
    console.log(user_id);
    const user = await User.findById(user_id.id)
    res.send({name:user.name,items:user.items})
})


router.post('/add-item',auth,async (req,res)=>{

    try {
        
        const {item} = req.body
        console.log(item);
        const user_id = req.user
        const user = await User.findById(user_id.id)
        user.items.push({id:uuid(),isCompleted:false,itemName:item})
        await user.save()
        res.send({message:'Item added successfully'})
    } catch (error) {
        res.status(500).send({message:'Something went wrong'})
    }

})
router.post('/update-status/:itemId', auth, async (req, res) => {
    const { itemId } = req.params;
    const user_id = req.user;

    const user = await User.findById(user_id.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.items.find(item => item._id.toString() === itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isCompleted = !item.isCompleted;

    await user.save();

    res.send({ message: 'Item updated successfully' });
});


router.delete('/delete-item/:itemId', auth, async (req, res) => {
    const { itemId } = req.params;
    const user_id = req.user;

    try {
        const user = await User.findById(user_id.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        user.items = user.items.filter(item => item._id.toString() !== itemId);

        await user.save();

        res.send({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.delete('/delete-item', auth, async (req, res) => {
   
    const user_id = req.user;

    try {
        const user = await User.findById(user_id.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        user.items = user.items.filter(item => !item.isCompleted);
        await user.save();

        res.send({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router