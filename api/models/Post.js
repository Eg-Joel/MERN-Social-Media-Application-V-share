const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    title:{
        type:String,
        required:true,
        
    },
    image:{
        type:String,
       
    },
    video:{
        type:String,
       
    },
    like:{
        type:Array,
       
    },
    dislike:{
        type:Array,
       
    },
    comments:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                required:true
            },
            username:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
            profile:{
                type:String,
            }
        }

    ]
})

module.exports = mongoose.model("Post",PostSchema)