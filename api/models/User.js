const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
        
    },
    phonenumber:{
        type:Number,
        required:[true,"Phone number is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    followers:{
        type:Array,
       
    },
    following:{
        type:Array,
       
    },
    profile:{
        type:String,
    },
    verfied:{
        type:Boolean,
        required:true,
        default:false
    }
})

module.exports = mongoose.model("User",UserSchema)