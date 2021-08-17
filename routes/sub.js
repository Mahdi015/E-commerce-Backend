const express = require("express")
const router = express.Router();

// Controller
const {create,read , update,remove,list,} = require('../controllers/sub');


// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");

//routes
router.post('/sub',authCheck,admincheck,create)
router.get('/sub/:slug',read)
router.get('/subs',list)
router.put('/sub/:slug',authCheck,admincheck,update)
router.delete('/sub/:slug',authCheck,admincheck,remove)



module.exports = router;