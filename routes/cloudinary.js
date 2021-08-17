const express = require("express")
const router = express.Router();


// Controller
const {upload, remove} = require('../controllers/cloudinary');


// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");


router.post('/uploadimages',authCheck,admincheck,upload)
router.post('/removeimage',authCheck,admincheck,remove)

module.exports=router