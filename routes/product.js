const express = require("express")
const router = express.Router();

// Controller
const {create,list,remove,listoneproduct,update,listbysort,productCount,productstart,listRelated,searchfilters } = require('../controllers/product');


// MiddleWares
const {  authCheck, admincheck} = require("../middlewares/auth");




//routes
router.post('/Product',authCheck,admincheck,    create)
router.get('/Products/count',productCount)
router.get('/Products/:count',list)
router.delete('/Product/:slug',authCheck,admincheck,remove)
router.get('/Product/:slug',listoneproduct)
router.put('/Product/:slug',authCheck,admincheck,update)
router.post('/Products',listbysort)
router.put('/:productId',authCheck,productstart)
//related
router.get('/Product/related/:productId',listRelated)
//search
router.post('/search/filters',searchfilters)



module.exports = router;