require('dotenv').config();
require("./db/connect")
const express = require("express")
const app = express();
const cors = require('cors');

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use(cors());

app.use(require('./routes/student'))

app.get('/', async (req,res)=> {
    res.send("Hello World");
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`App is listening on port ${process.env.PORT || 3000}`);
})