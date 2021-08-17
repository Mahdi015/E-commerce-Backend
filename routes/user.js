const express = require("express")
const router = express.Router();


// Controller
const {userCart,getUserCart,emptyCart,userAddAdresse,getUSerAdresse,applyCoupon,createOrder,getUSerOrders,addToWishList,whishlist,removeFromWhishList,createCashOrder} = require('../controllers/user');


// MiddleWares
const {authCheck} = require("../middlewares/auth");

//routes
router.post('/user/cart',authCheck,userCart)
router.get('/user/cart',authCheck,getUserCart)
router.put('/user/cart',authCheck,emptyCart)
router.post('/user/adresse',authCheck,userAddAdresse)
router.get('/user/adresse',authCheck,getUSerAdresse)


//coupon
router.post('/user/cartcoupon',authCheck,applyCoupon)


//order
router.post('/user/order',authCheck,createOrder)
router.get('/user/orders',authCheck,getUSerOrders)
//cod
router.post('/user/cash/order',authCheck,createCashOrder)

//WishList
router.post('/user/whishlist',authCheck,addToWishList)
router.get('/user/whishlist',authCheck,whishlist)
router.put('/user/whishlist/:productId',authCheck,removeFromWhishList)

// router.get('/user',(req,res)=>{
//     res.json({
//         data: 'usqdsqdser',
//     });
// });

module.exports = router;