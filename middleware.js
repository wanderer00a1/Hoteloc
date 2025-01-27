const expressError = require("./utils/expressError");

const { hotelSchema,reviewSchema } = require('./schemas');
const Hotel = require('./models/hoteloc');
const Review = require('./models/reviews');

 

module.exports.isLoggedin = (req,res,next) =>{
    // console.log("req.user",req.user)
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error','You Must be Signed In');
        return res.redirect('/login')
      }
      next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateSchema = ( req,res,next) =>{
  const {error}  = hotelSchema.validate(req.body);
    if( error  ){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg , 400);
    }else{
      next();
    }
  }

module.exports.isAuthor = async (req,res,next) =>{
  const { id } = req.params;
  const hotel = await Hotel.findById(id);
  if(!hotel.author.equals(req.user._id)){
    req.flash('error','Invalid Request');
    res.redirect('/hotels');
  }
  next();
}

module.exports.validateReviews = (req,res,next) =>{
  const {error}  = reviewSchema.validate(req.body);
  if( error  ){
      const msg = error.details.map(el => el.message).join(',');
      throw new expressError(msg , 400);
  }else{
    next();
  }
}

module.exports.reviewAuthor = async (req,res,next) =>{
  const { id,reviewID } = req.params;
  const review = await Review.findById(reviewID);
  if(!review.author.equals(req.user._id)){
    req.flash('error','Invalid Request');
    res.redirect('/hotels');
  }
  next();
}


