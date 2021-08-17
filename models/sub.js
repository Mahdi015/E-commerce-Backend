const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const SubSchema = mongoose.Schema(
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
    parent: {type: ObjectId, ref:"Category", required:true},
},{timestamps: true}
)

module.exports = mongoose.model('Sub',SubSchema)