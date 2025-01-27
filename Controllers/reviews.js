const Hotel = require('../models/hoteloc.js');
const Review = require('../models/reviews.js');


const handleAsync = require('../utils/handleAsync');

module.exports.createReview = handleAsync(async(req,res)=>{
    
    const hotel = await Hotel.findById(req.params.id);
    // console.log(req.params);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hotel.reviews.push(review);
  
    await review.save();
    await hotel.save();
    req.flash('success','Review Created ');
    res.redirect(`/hotels/${hotel._id}`);
})

module.exports.deleteReview = handleAsync(async(req,res) =>{
    const { id, reviewID } = req.params;
    await Hotel.findByIdAndUpdate(id,{$pull:{reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);

    req.flash('success','Review Deleted');
    res.redirect(`/hotels/${id}`);
  })