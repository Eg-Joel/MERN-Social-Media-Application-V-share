const { adminLogin } = require("../controllers/adminController");

const router = require("express").Router()

//admin login
router.post("/admin-login",adminLogin);

module.exports = router