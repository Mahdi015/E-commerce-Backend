const slugify = require('slugify');
const sub = require('../models/sub');
const  product = require('../models/product')


exports.create = async (req,res) => {
    try{
        const {name ,parent} = req.body
        const createsub = await new sub({name,parent,slug: slugify(name)}).save();
        res.json(createsub)
    }catch(err){
        res.status(400).send('Creat Sub failed')
    }
};
exports.list = async(req,res) =>   res.json(await sub.find({}).sort({createdAt: -1}).exec());


exports.remove = async(req,res) => {
   try{
       const deleted = await sub.findOneAndDelete({slug: req.params.slug});
       res.json(deleted)
   }catch(err){
    res.status(400).send('Delete Failed')
   }
};
exports.update =async (req,res) => {

    const {name,parent} = req.body
    try{    
        const updatetd = await sub.findOneAndUpdate({slug: req.params.slug}, {name,parent, slug: slugify(name)},{new : true})
        res.json(updatetd)

    }catch(err){
        res.status(400).send('Update failed')
    }

};
exports.read = async(req,res) => {
    let readsub = await sub.findOne({slug: req.params.slug}).exec()
   // res.json(readsub)
   let findproducts = await product.find({subs : readsub})
   .exec()
   res.json({readsub,findproducts})
};