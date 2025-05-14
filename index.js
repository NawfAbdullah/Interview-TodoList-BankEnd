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

mongoose.connect('mongodb://localhost:27017/interview',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Database connected');
}).catch(err=>console.error(err)
);

app.listen(5000,()=> console.log("Server running on port 5000"))