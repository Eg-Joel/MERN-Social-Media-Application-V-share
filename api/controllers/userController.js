const { validationResult } = require("express-validator")
const { validate } = require("../models/User")
const User = require("../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { post } = require("../router/user");
const jwtSEC = "#2idfbfb$%TTtrr123##"
const Post = require("../models/Post");
const VerificationToken=require("../models/verificationToken")
const ResetToken = require("../models/ResetToken")
const { generateOTP } = require("../router/otp/mail");
const nodemailer = require('nodemailer')
const crypto = require("crypto")



exports.createUser =async (req,res)=>{
    const error = validationResult(req)
    // if(!error.isEmpty()){
    //     return res.status(400).json('some error occured')
    // }
    // try {
     
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(200).json("Please login with correct password")
    };
    let password = req.body.password
   
    const salt = await bcrypt.genSalt(10);
    const hashPas = await bcrypt.hash(password, salt)
    console.log(process.env.USER);
    user = await User.create({
        username:req.body.username,
        email:req.body.email,
        password:hashPas,
        profile:req.body.profile,
        phonenumber:req.body.phonenumber
    })
    const accessToken = jwt.sign({
        id:user._id,
        username:user.username
    },jwtSEC)
    const OTP = generateOTP()
    const verificationToken =await VerificationToken.create({
        user:user._id,
        token:OTP
    })
    verificationToken.save()
    await user.save();

      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"V-Share@gmail.com",
        to:user.email,
        subject:"Verify your email using OTP",
        html:`<h1>Your OTP code  ${OTP}</h1>`
      })
    
    res.status(200).json({Status:"pending",msg:"Please check your email",user:user._id})

// } catch (error) {
//         return res.status(400).json('internal error occured')
// }
}

exports.verifyEmail = async (req,res)=>{
    const {user, OTP} = req.body
    const mainUser = await User.findById(user)
    if(!mainUser)return res.status(400).json("User not found")
    if(mainUser.verfied === true){
        return res.status(400).json("user already verfied")
        
    }
    const token = await VerificationToken.findOne({user:mainUser._id})
    if(!token){
        return res.status(400).json("sorry token not found")
    }
    const isMatch =await bcrypt.compareSync(OTP, token.token)
    if(!isMatch){return res.status(400).json("Token is not vaild")}
    mainUser.verfied = true
    await VerificationToken.findByIdAndDelete(token._id)
    await mainUser.save()
    const accessToken = jwt.sign({
        id:mainUser._id,
        username:mainUser.username
        
    } , jwtSEC)
    const {password ,...other}= mainUser._doc
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"V-Share@gmail.com",
        to:mainUser.email,
        subject:"Successfuly Verified your email ",
        html:`Now you can login `
      })
      return res.status(200).json({other,accessToken})
}

exports.login = async(req,res)=>{
    const error = validationResult(req)
    // if(!error.isEmpty()){
    //     return res.status(400).json('some error occured')
    // }
    try {
        
    
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json("user not found")
    }

    const ComparePassword = await bcrypt.compare(req.body.password,user.password)
    if(!ComparePassword){
        return res.status(400).json("Password error")
    }
    const accessToken = jwt.sign({
        id:user._id,
        username:user.username
    },jwtSEC)
    const {password , ...other} = user._doc
    res.status(200).json({other,accessToken})
} catch (error) {
        res.status(500).json('internal error occured')
}
}

exports.forgotPassword = async(req,res)=>{
 
    const {email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).json("User not found");
    }
  
    const token = await ResetToken.findOne({user:user._id});
    if(token){
        return res.status(400).json("After one hour you can request for another token");
    }

    const RandomTxt = crypto.randomBytes(20).toString('hex');
    const resetToken = new ResetToken({
        user:user._id,
        token:RandomTxt
    });
    
    await resetToken.save();
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"V-Share@gmail.com",
        to:user.email,
        subject:"reset token ",
        html:`http://localhost:3000/reset/password?token=${RandomTxt}&_id=${user._id}`
      })

      return res.status(200).json("Check your email to reset password")
}

exports.resetPassword = async(req,res)=>{

    const {token , _id} = req.query;
    if(!token || !_id){
        return res.status(400).json("Invalid req");
    }
    const user = await User.findOne({_id:_id});
    if(!user){
        return res.status(400).json("user not found")
    }
    const resetToken = await ResetToken.findOne({user:user._id});
    if(!resetToken){
        return res.status(400).json("Reset token is not found")
    }
    console.log(resetToken.token)
    const isMatch = await bcrypt.compareSync(token , resetToken.token);
    if(!isMatch){
        return res.status(400).json("Token is not valid");
    }

    const {password} = req.body;
    // const salt = await bcrypt.getSalt(10);
    const secpass = await bcrypt.hash(password , 10);
    user.password = secpass;
    await user.save();
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"sociaMedia@gmail.com",
        to:user.email,
        subject:"Your password reset successfully",
        html:`Now you can login with new password`
      })

      return res.status(200).json("Email has been send")

}

exports.following = async(req,res)=>{
    if(req.params.id !== req.user.id){
       
        
        const user = await User.findById(req.params.id)
        const otheruser = await User.findById(req.user.id)

        if(!user.followers.includes(req.user.id)){
            await user.updateOne({$push:{followers:req.user.id}})
            await otheruser.updateOne({$push:{following:req.params.id}})
            return res.status(200).json("user has followed")

        }else{
            await user.updateOne({$pull:{followers:req.user.id}})
            await otheruser.updateOne({$pull:{following:req.params.id}})
            return res.status(200).json("user has unfollowed")
        }
    }else{
        return res.status(400).json("you can't follow yourself")
    }
}
exports.followerPost = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const followerspost= await Promise.all(
            user.following.map((item)=>{
                return Post.find({user:item})
            })
        )
        const userPost = await Post.find({user:user._id})
        res.status(200).json(userPost.concat(...followerspost))
    } catch (error) {
        return res.status(500).json("internal server error occured")
    }
}
exports.updateProfile = async(req,res)=>{
    try {
        if(req.params.id !== req.user.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const secpass = await bcrypt.hash(req.body.password,salt)
            req.body.password= secpass
            const updateUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            })
            await updateUser.save()
            res.status(200).json(updateUser)
        }
    }else{
        return res.status(400).json("you are not allow to update this user")
    }
    } catch (error) {
        return res.status(500).json("internal server error occured")
    }
}

exports.deleteUser = async(req,res)=>{
    try {
        if(req.params.id !== req.user.id){
            return res.status(400).json("user account doesn't match")
        }else{
            await User.findByIdAndDelete(req.params.id)
            return res.status(200).json("user account deleted")
        }
    } catch (error) {
        
        return res.status(500).json("internal server error occured")
    }
}

exports.userDetailPost =async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(400).json("user not found")
        }
        const {email, password, phonenumber, ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        return res.status(500).json("internal server error occured")
    
    }
}

exports.userToFollow = async(req,res)=>{
    try {
        const allUser = await User.find();
        const user = await User.findById(req.params.id)
     
        const followingUser = await Promise.all(
            user.following.map((item)=>{
                return item
            })
        )
        let usersToFollow = allUser.filter((val)=>{
            return !followingUser.find((item)=>{
                return val._id.toString()===item
            })
        })
        let filterUser = await Promise.all(
            usersToFollow.map((item)=>{
                const {email , phonenumber , followers , following , password ,...others } = item._doc
                return others
            })
        )
        res.status(200).json(filterUser)
    } catch (error) {
        
    }
}