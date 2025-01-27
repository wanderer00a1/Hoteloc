const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const reviewSchema = Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Review',reviewSchema)