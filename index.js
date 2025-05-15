require('dotenv').config(); 
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Authencation = require('./routes/Authentication')
const List = require("./routes/Todo")
const app = express();

app.use(cors())
app.use(express.json())

app.use('/auth',Authencation)
app.use('/list',List)
console.log(process.env.MONGO);

mongoose.connect(`mongodb+srv://nawfabdullah2711:${process.env.MONGO}@cluster0.jnxwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Database connected');
}).catch(err=>console.error(err)
);

app.listen(5000,()=> console.log("Server running on port 5000"))