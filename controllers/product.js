const product = require('../models/product')
const user = require('../models/user')
const slugify = require('slugify')
const { populate, aggregate } = require('../models/product')



exports.create = async(req,res)=>{
    try{
        req.body.slug = slugify(req.body.title)
        console.log(req.body)
        const newProduct = await new product(req.body).save()
        res.json(newProduct)

    }catch (err){   
        console.log(err)
        //res.status(400).send('Creat Product Failed')
        res.status(400).json({
            err: err.message,
        })
    }
}

exports.list = async(req,res)=>{
    let products = await product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt','desc']])
    .exec()
    res.json(products)
}

exports.remove = async (req,res)=>{
    try {
        
        const deleted = await product.findOneAndRemove({slug : req.params.slug,}).exec()
        res.json(deleted);
    }
    catch(err){
        console.log(err)
        return res.status(400).send('Product Delete Failed')
    }
}

exports.listoneproduct = async (req,res) =>{
    products = await product.findOne({slug:req.params.slug})
    .populate('category')
    .populate('subs')
    .exec()
    res.json(products)
}
exports.update = async (req,res) =>{
    try{
        
        if(req.body.title){
            req.body.slug = slugify(req.body.title)}
            const updated = await product.findOneAndUpdate({slug:req.params.slug},req.body,{new : true}).exec()
            res.json(updated)
        

    }
    catch(err){
        console.log(err)
     //   return res.status(400).send('Product Update Failed')
     res.status(400).json({
        err: err.message,
    })
    }
}

// Without Pagination
// exports.listbysort = async (req,res) =>{
//     try{
//         const {sort, order, limit} = req.body
//         const products = await product.find({})
//             .populate('category')
//             .populate('subs')
//             .sort([[sort,order]])
//             .limit(limit)
//             .exec()
//         res.json(products)
//     }
//     catch(err){
//         console.log(err)
//     }

// }



//With Pagination


exports.listbysort = async (req,res) =>{
    try{
        const {sort, order, page} = req.body
        const currentPage = page || 1
        const perPage = 3

        const products = await product.find({})
            .skip((currentPage - 1)*perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort,order]])
            .limit(perPage)
            .exec()
        res.json(products)
    }
    catch(err){
        console.log(err)
    }

}

exports.productCount = async (req,res) =>{
   
        let total = await product.find({}).estimatedDocumentCount()
        res.json(total);
   
}


exports.productstart = async (req,res) =>{

    const findproduct = await product.findById(req.params.productId).exec() 
    const finduser = await user.findOne({email:req.user.email}).exec()
    const {star} = req.body
    

    let existingRatingObjecct  = findproduct.ratings.find((ele)=>ele.postedBy.toString() === finduser._id.toString())
   // console.log(existingRatingObjecct)


    if (existingRatingObjecct === undefined){
     //   console.log('lena')
       
    
        let ratingadded = await product.findByIdAndUpdate(findproduct._id,{
            $push: { ratings:{star ,postedBy:finduser._id} },
        },{new:true}).exec()
    //    console.log(ratingadded);
        res.json(ratingadded)

    }else{

       

    const rattingUpdate = await product.updateOne({ratings:{$elemMatch:existingRatingObjecct},
    },
    {$set:{'ratings.$.star':star}},
    {new:true}
    ).exec()
  //  console.log('rattingUpdate')
    res.json(rattingUpdate)
    }
 
    }



    exports.listRelated = async (req,res) =>{ 
        const prod = await product.findById(req.params.productId).exec()
        const related = await product.find({
            _id: { $ne : prod._id},
            category: prod.category,
        })
        .limit(3)
        .populate('category')
        .populate('subs')
        .populate('postedBy')
        .exec();
    res.json(related)
    }

    

//Search ,, Filters

const handlequer = async(req,res,query) =>{
    const products = await product.find({$text:{$search : query}})
    .populate('category' , '_id name')
    .populate('subs', '_id name')
    .populate('postedBy' , '_id name')
    .exec()
    res.json(products)
}
const handleprice = async(req,res,price) =>{
    try{
        let products = await product.find({
            price:{
                $gte : price[0],
                $lte : price[1],
            },
        })
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}
    

const handleCategory = async(req,res,category) =>{
    try{
        let products = await product.find({category})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}


const handleStars = (req,res,stars) =>{
    product.aggregate([
        {
            $project:{
                document: '$$ROOT',
                floorAverage:{
                    $floor: {$avg:'$ratings.star'},
                },
            },
        },
        {$match: {floorAverage:stars}}
    ])
    .limit(12)
    .exec((err,aggregate)=>{
        if (err) console.log(err);
        product.find({_id:aggregate})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec((err,products)=>{
        if(err) console.log(err);
        res.json(products)
            
        })
    })

}
const HandleSubs = async(req,res,sub) =>{
    try{
        let products = await product.find({subs : sub})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}
const handleShipping = async(req,res,shipping) =>{
    try{
        let products = await product.find({shipping})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}
const handleColor = async(req,res,color) =>{
    try{
        let products = await product.find({color})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}
const handleBrand = async(req,res,brand) =>{
    try{
        let products = await product.find({brand})
        .populate('category' , '_id name')
        .populate('subs', '_id name')
        .populate('postedBy' , '_id name')
        .exec()
        res.json(products)
    }  catch(err){
        console.log(err);
    }
}


exports.searchfilters = async (req,res) => {
    const {query , price , category, stars , sub , shipping , color , brand} = req.body

    if (query) {
        //console.log(query)
        await handlequer(req,res,query)
    }
    if (price !== undefined){
        //console.log('Price',price)
        await handleprice(req,res,price)
    }
    if (category){
        //console.log(category)
        await handleCategory(req,res,category)
    }
    if (stars){
        //console.log(stars)
        await handleStars(req,res,stars)
    }
    if (sub){
        //console.log(sub)
        await HandleSubs(req,res,sub)
    }
    if (shipping){
        console.log(shipping)
        await handleShipping(req,res,shipping)
    }
    if (color){
        console.log(color)
        await handleColor(req,res,color)
    }
    if (brand){
        console.log(brand)
        await handleBrand(req,res,brand)
    }

}
