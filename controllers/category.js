const Category = require('../models/category')
const slugify = require('slugify');
const category = require('../models/category');
const subss = require('../models/sub');
const { subscribe } = require('../routes/category');
const product = require('../models/product');


exports.create = async (req,res) => {
    try{
        const {name} = req.body
        const category = await new Category({name,slug: slugify(name)}).save();
        res.json(category)
    }catch(err){
        res.status(400).send('Creat Category failed')
    }
};
exports.list = async(req,res) =>   res.json(await Category.find({}).sort({createdAt: -1}).exec());


exports.remove = async(req,res) => {
   try{
       const deleted = await category.findOneAndDelete({slug: req.params.slug});
       res.json(deleted)
   }catch(err){
    res.status(400).send('Delete Failed')
   }
};
exports.update =async (req,res) => {

    const {name} = req.body
    try{    
        const updatetd = await Category.findOneAndUpdate({slug: req.params.slug}, {name, slug: slugify(name)},{new : true})
        res.json(updatetd)

    }catch(err){
        res.status(400).send('Update failed')
    }

};
exports.read = async(req,res) => {
    let readcategory = await Category.findOne({slug: req.params.slug}).exec()
   // res.json(readcategory)
     let findproducts = await product.find({category : readcategory })
    .populate('category')
     .exec()
    res.json({readcategory,findproducts})
};

exports.getsubs = (req,res) =>{
    subss.find({parent: req.params._id}).exec((err, subs)=>{
        if (err) console.log(err)
        res.json(subs)
    })
}