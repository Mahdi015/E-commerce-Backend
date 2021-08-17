const express = require("express")
const router = express.Router();

// Controller
const {create,remove,list,} = require('../controllers/coupon');


// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");

//routes
router.post('/coupon',authCheck,admincheck,create)
router.get('/coupons',list)
router.delete('/coupon/:couponId',authCheck,admincheck,remove)



module.exports = router;