const User = require('../models/user')

exports.creatorupdateuser = async(req,res)=>{
    const {email, name , picture} = req.user
    const user = await User.findOneAndUpdate({email},{name:email.split('@')[0] , picture},{new: true})

    if (user) {
        console.log('User Updated')
        res.json(user)
    }else {
        const newUser = await new User({
            email,
            name:email.split('@')[0] ,
            picture
        }).save(); 
        console.log('New USer Aded') 
        res.json(newUser);
    }
  
};

exports.currentuser = async (req,res) =>{
    User.findOne({email:req.user.email}).exec((err,user)=>{
        if (err) throw new error(err);
        res.json(user);
    });
};