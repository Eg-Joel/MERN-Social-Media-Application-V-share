const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const verificationTokenSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
        
    },
    createAt:{
        type:String,
        required:true
        
    }
})
verificationTokenSchema.pre("save",async(next)=>{
    const salt = await bcrypt.genSalt(10);
    if(this.isModified("token")){
              const hash = await bcrypt.hash(this.token , salt);
              this.token = hash
    }
    next();
})
module.exports = mongoose.model("verificationToken",verificationTokenSchema)