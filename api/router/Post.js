const router = require("express").Router()
const { createPost, getPost, updatePost, postLike, postDisLike, comments, deletePost, followingUser, followersr, followers } = require('../controllers/PostController')
const { verifyToken } = require("../middlewares/verifyToken")

//create post
router.post("/user/post",verifyToken,createPost)

//get post
router.get("/get/post/:id",getPost)

//update post
router.put("/update/post/:id",verifyToken,updatePost)

//like 
router.put("/:id/like",verifyToken,postLike)

//dislike
router.put("/:id/dislike",verifyToken,postDisLike)

//comment
router.put("/comment/post",verifyToken, comments)

//delete post
router.delete("/deletepost/:id",verifyToken , deletePost)

//get a following user
router.get("/following/:id", followingUser)

//get a followers
router.get("/followers/:id", followers)

module.exports = router