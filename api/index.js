const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRouter = require("./router/user")
const postRouter = require("./router/Post")
const adminRouter = require("./router/admin")
const cors = require("cors");
dotenv.config()


mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("database connected");
})

app.use(cors());
app.use(express.json())
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/admin",adminRouter)
app.listen(5000,()=>{
    console.log("server is running");
})