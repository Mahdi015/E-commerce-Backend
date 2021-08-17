const express = require("express")
const router = express.Router();
 



// Controller
const {orders, orderStatus} = require('../controllers/admin');

// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");

//routes

router.get('/admin/orders',authCheck,admincheck,orders)

router.put('/admin/order-status',authCheck,admincheck,orderStatus)


module.exports=router