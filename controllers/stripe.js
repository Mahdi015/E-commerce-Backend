const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET);


exports.createPaymentIntent = async(req,res)=>{
    const {couponApplied} = req.body
  
     
    const user = await User.findOne({email:req.user.email}).exec()
   

    const {cartTotal , totalAfterDiscount} = await Cart.findOne({orderBy:user._id}).exec()
  
    let finalAmount = 0
    if (couponApplied && totalAfterDiscount){
        finalAmount = Math.round(totalAfterDiscount * 100)
    }else {
        finalAmount = Math.round(cartTotal * 100)
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount : finalAmount,
        currency: 'usd',
    })

    res.send({clientSecret:paymentIntent.client_secret,cartTotal,totalAfterDiscount,payable:finalAmount})
};