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
    reports:{
        type: Array,
        default: [],
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
            },
            createdAt:{
                type: Date,
                default: Date.now,
                required:true
              },
              
        }

    ]
},
{timestamps: true}
)

module.exports = mongoose.model("Post",PostSchema)