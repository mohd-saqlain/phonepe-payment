const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    phoneNo:{
        unique:true,
        type:String,
        required:true,
    },
    email:String,
    refferalCode:String,
    attendanceMode:{
        type:String,
        enum:["online","offline"],
        default:"online"
    },
}, { timestamps: true });

module.exports = mongoose.model("Student",studentSchema);