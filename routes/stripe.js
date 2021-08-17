const express = require("express")
const router = express.Router();


const {createPaymentIntent} = require('../controllers/stripe')



// MiddleWaresy
const {  authCheck, admincheck} = require("../middlewares/auth");

router.post('/create-payment-intent',authCheck,createPaymentIntent)

module.exports = router;