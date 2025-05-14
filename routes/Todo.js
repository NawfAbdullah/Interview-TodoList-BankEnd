const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('../middleware/auth');
const {v4:uuid} = require('uuid') 
const { default: mongoose } = require('mongoose');

router.get('/',auth,async (req,res)=>{
    const user_id = req.user
    console.log(user_id);
    const user = await User.findById(user_id.id)
    res.send({name:user.name,items:user.items})
})


router.post('/add-item',auth,async (req,res)=>{

    const {item} = req.body
    console.log(item);
    const user_id = req.user
    const user = await User.findById(user_id.id)
    user.items.push({id:uuid(),isCompleted:false,itemName:item})
    await user.save()
    res.send({message:'Item added successfully'})
})

router.post('/update-status/:itemId',auth,async (req,res)=>{
    const {itemId} = req.params
    //console.log(item);
    const user_id = req.user
    const user = await User.findById(user_id.id)

    for (let index = 0; index < user.items.length; index++) {
        const element = user.items[index];
        if(element&&element.id==itemId){
            user.items[index].isCompleted = !user.items[index].isCompleted  
            break;
        }
    }
    await user.save()
    res.send({message:'Item updated successfully'})
})

router.delete('/delete-item/:itemId',auth,async (req,res)=>{
    const {itemId} = req.params
    //console.log(item);
    const user_id = req.user
    const user = await User.findById(user_id.id)
    user.items = user.items.filter((item,index)=>item.id!=itemId)
    await user.save()
    res.send({message:'Item deleted successfully'})
})

module.exports = router