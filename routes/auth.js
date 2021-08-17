const express = require("express")
const router = express.Router();

// Controller
const {creatorupdateuser, currentuser} = require('../controllers/auth');


// MiddleWares
const { authCheck , admincheck} = require("../middlewares/auth");
router.post('/CreatOrUpdate',authCheck,creatorupdateuser);
router.post('/CurrentUSer',authCheck,currentuser);
router.post('/Currentadmin',authCheck,admincheck,currentuser);

module.exports = router;