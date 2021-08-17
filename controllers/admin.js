const Order = require('../models/order');
const { ObjectID } = require('mongodb');




exports.orders = async (req,res)=>{
    let orders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product')
    .exec()
    res.json(orders)
}


exports.orderStatus = async(req,res)=>{
    console.log(req.body)
    const {orderId , orderStatus} = req.body
    let updated = await Order.findByIdAndUpdate(orderId,{orderStatus},{new:true}).exec()  
    res.json(updated)
}