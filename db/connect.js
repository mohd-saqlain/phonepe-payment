const mongoose = require("mongoose")

module.exports = mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Mongo Connected')).catch((err)=>console.log(err))