const product = require('../models/product');
const Cart = require('../models/cart');
const user = require('../models/user');
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const uniqueid = require('uniqueid')
exports.userCart = async(req,res) =>{
    //console.log(req.body)
    const {cart} = req.body
    
    let products = []

    const User = await user.findOne({email:req.user.email}).exec()

    let cartExistByThisUSer = await Cart.findOne({orderBy:User._id}).exec()

    if (cartExistByThisUSer){
        cartExistByThisUSer.remove()
        console.log('removed old cart')
    }

    for (let i=0 ; i< cart.length ; i++){
        let object = {}
        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color
        let productfromdb = await product.findById(cart[i]._id).select('price').exec();
        object.price = productfromdb.price

        products.push(object)
    }
    console.log(products)

    let cartTotal = 0
    for(let i=0;i<products.length;i++){
        cartTotal = cartTotal + products[i].price * products[i].count
    }
    console.log(cartTotal)

    let newCart = await new Cart({
        products,
        cartTotal,
        orderBy:User._id,
    }).save()
    console.log('new cart added',newCart)
    res.json({ok:true})
}


exports.getUserCart = async (req,res) =>{
    const User = await user.findOne({email:req.user.email}).exec()
    let cart = await Cart.findOne({orderBy:User._id})
    .populate('products.product','_id title price ')
    .exec()

    const {products,cartTotal} = cart
    res.json({products,cartTotal})
}

exports.emptyCart = async(req,res)=>{
    const User = await user.findOne({email:req.user.email}).exec()
    const cart = await Cart.findOneAndRemove({orderBy:User._id}).exec()
    res.json(cart)
}

exports.userAddAdresse = async(req,res)=>{
    try{
    const adresse = await user.findOneAndUpdate({email:req.user.email},{adresse:req.body.adresse}).exec()
    res.json({ok:true})
    }catch(err){
        console.log(err);
    }
}

exports.getUSerAdresse = async(req,res)=>{
      const adresse = await user.findOne({email:req.user.email}).select('adresse')
      res.json(adresse)
}


exports.applyCoupon = async(req,res) =>{
    const {coupon} = req.body

    const validCoupon = await Coupon.findOne({name:coupon}).exec()

    if (validCoupon === null){
        return res.json({
            err:'Invalid Coupon',
        })
    }
    const User = await user.findOne({email:req.user.email}).exec()
    
    let {products,cartTotal} = await Cart.findOne({orderBy:User._id})
    .populate('products.product','_id title price')
    .exec()

    //total after discount
    let totalAfterDiscount = (cartTotal -(cartTotal*validCoupon.discount/100)).toFixed(2)

    Cart.findOneAndUpdate({orderBy:User._id},{totalAfterDiscount:totalAfterDiscount},{new:true}).exec();
    console.log(totalAfterDiscount)


    res.json(totalAfterDiscount)
}


exports.createOrder = async (req,res) =>{
   const  {paymentIntent} = req.body.stripeResponse
   const User = await user.findOne({email:req.user.email}).exec()
   let {products} = await Cart.findOne({orderBy:User._id}).exec()

   let newOrder = await new Order({
       products,
       paymentIntent,
       orderBy:User._id,
   }).save()
   // dec quantity inc solds    
   let bulkOption = products.map((p)=>{
       return{
           updateOne: {
               filter : {_id : p.product._id },
               update:{$inc:{quantity:-p.count , sold:+p.count}},
           },
       };
   });

   let updated = await product.bulkWrite(bulkOption,{})
   console.log(updated)
   console.log('New Order created',newOrder)
   res.json({ok:true})
}

exports.getUSerOrders = async (req,res) =>{
    let User = await user.findOne({email:req.user.email}).exec()

    let userOrders = await Order.find({orderBy:User._id}).populate('products.product').exec()

    res.json(userOrders);
}

exports.addToWishList = async(req,res)=>{
    const {productId} = req.body
    User = await user.findOneAndUpdate({email:req.user.email},{$addToSet:{wishlist:productId}},{new:true}).exec()
    res.json({ok:true})

}
exports.whishlist = async(req,res)=>{
  
   const group = await user.findOne({email:req.user.email}).select('wishlist').populate('wishlist').exec()
    res.json(group)



    
}
exports.removeFromWhishList = async(req,res)=>{
    const {productId} = req.params
    User = await user.findOneAndUpdate({email:req.user.email},{$pull:{wishlist:productId}}).exec()
    res.json({ok:true})
}



exports.createCashOrder = async (req,res) =>{
 
    const User = await user.findOne({email:req.user.email}).exec()
    //const {couponApplied} = req.body
    let userCart = await Cart.findOne({orderBy:User._id}).exec()
    const {couponState} = req.body

    let finalAmount = 0
    if (couponState && userCart.totalAfterDiscount){
        finalAmount = userCart.totalAfterDiscount 

    }else {
        finalAmount = userCart.cartTotal

    }
    let newOrder = await new Order({
        products:userCart.products,
        paymentIntent:{
            id: uniqueid(),
            amount: finalAmount.toFixed(2),
            currency: 'USD',
            status: 'Cash On Delivery',
            created: Date.now(),
            payment_method_types: ['Cash On Delivery'],
        },
        orderBy:User._id,
        orderStatus:'Cash On Delivery'
    }).save()
    // dec quantity inc solds    
    let bulkOption = userCart.products.map((p)=>{
        return{
            updateOne: {
                filter : {_id : p.product._id },
                update:{$inc:{quantity:-p.count , sold:+p.count}},
            },
        };
    });
 
    let updated = await product.bulkWrite(bulkOption,{})
    console.log(updated)
    console.log('New Order created',newOrder)
    res.json({ok:true})
 }