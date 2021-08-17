const express = require("express")
const router = express.Router();

// Controller
const {create,read , update,remove,list,getsubs} = require('../controllers/category');


// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");

//routes
router.post('/Category',authCheck,admincheck,create)
router.get('/Category/:slug',read)
router.get('/Categories',list)
router.put('/Category/:slug',authCheck,admincheck,update)
router.delete('/Category/:slug',authCheck,admincheck,remove)
router.get('/Category/subs/:_id',getsubs)



module.exports = router;