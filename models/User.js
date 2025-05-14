const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
            id:String,
            itemName:String,
            isCompleted:Boolean,            
        })

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reqired:true
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String
    },
    items:[itemSchema]
})


module.exports = mongoose.model('User',userSchema)