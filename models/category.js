const mongoose = require('mongoose')


const CategorySchema = mongoose.Schema(
    {
    name: {
        type: String,
        trim: true,
        required: 'Name Is Required',
        minlength: [3,'To Short'],
        maxlength: [32,'To long'],
    },
    slug:{
        type: String,
        unique: true,
        lowercase: true,
        index: true,

    },  
},{timestamps: true}
)

module.exports = mongoose.model('Category',CategorySchema)