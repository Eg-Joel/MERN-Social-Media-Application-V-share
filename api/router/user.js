const router = require("express").Router()
const { body, validationResult } = require('express-validator')
const { createUser,login, following, followerPost, updateProfile, deleteUser, userDetailPost, userToFollow, verifyEmail } = require('../controllers/userController')
const { verifyToken } = require("../middlewares/verifyToken")


router.post("/create/user",
       body('email').isEmail(), 
       body('password').isLength({ min: 6 }), 
       body('username').isLength({ min: 3 }),
       body('phonenumber').isLength({ min: 10 }), createUser)

//verfiy email
router.post("/verfy/email",verifyEmail)

//login
router.post("/login",
       body('email').isEmail(), 
       body('password').isLength({ min: 6 }),login)

//follow
router.put("/follow/:id",verifyToken,following)

// get post from follwers
router.get("/followerpost/:id",verifyToken,followerPost)

// update profile
router.put("/update/:id",verifyToken, updateProfile)

//user delete
router.delete("/delete/:id",verifyToken,deleteUser)

//get user details for post
router.get("/post/user/details/:id",userDetailPost)

//get user to follow
router.get("/all/user/:id",userToFollow)

module.exports = router