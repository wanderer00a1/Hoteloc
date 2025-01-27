const mongoose = require('mongoose');
const {Schema} =  require('mongoose');
const Review = require('./reviews');

const ImageSchema = new Schema({
    url:String,
    filename:String
})


ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const HotelSchema = Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    description:String,
    price: Number,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts)


HotelSchema.virtual('properties.popUpMarkup').get(function (){
    return `<a href="/hotels/${this._id}">${this.title}</a>`;
})

HotelSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hotel', HotelSchema)