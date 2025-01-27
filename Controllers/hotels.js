const Hotel = require('../models/hoteloc');
const handleAsync = require('../utils/handleAsync');

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_TOKEN;

const {cloudinary} = require('../Cloudinary');

module.exports.hotelIndex = handleAsync(async(req,res,next) =>{
  const hotels = await Hotel.find({});
  res.render('hotels/index', {hotels});
});

module.exports.renderNew =  (req,res) =>{
    res.render('hotels/new');
};

module.exports.createNew = handleAsync(async (req,res,next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.hotel.location, {limit: 1});
  const hotel = new Hotel(req.body.hotel);
  hotel.geometry = geoData.features[0].geometry;
  hotel.images = req.files.map(f => ({url:f.path, filename:f.filename}));
  hotel.author = req.user._id;

  await hotel.save();
  console.log(hotel);
  req.flash('success','Hotel Added ');
  res.redirect(`/hotels/${hotel._id}`);
});

module.exports.show = handleAsync(async (req,res,next) => {
  const hotel = await Hotel.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path:'author'
    }
  }).populate('author');

  if(!hotel){
    req.flash('error','Cannot be Found');
    return res.redirect('/hotels');
  }

  console.log('Hotel object:', hotel); // Log the hotel object for debugging
  res.render('hotels/show', {hotel});
});

module.exports.renderEdit = handleAsync(async (req,res,next) => {
  const hotel = await Hotel.findById(req.params.id);

  if(!hotel){
    req.flash('error','Cannot be Found');
    return res.redirect('/hotels');
  }
  res.render('hotels/edit', {hotel});
});

module.exports.edit = handleAsync(async (req,res,next) => {
  const { id } = req.params;
  console.log(req.body);
  const hotel = await Hotel.findByIdAndUpdate(id,{...req.body.hotel});

  const geoData = await maptilerClient.geocoding.forward(req.body.hotel.location, {limit: 1});
  hotel.geometry = geoData.features[0].geometry;

  const imgs = req.files.map(f => ({url:f.path, filename:f.filename}));
  hotel.images.push(...imgs);
  await hotel.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await hotel.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
    console.log(hotel);
  }
  req.flash('success','Successfully Updated ');
  res.redirect(`/hotels/${hotel._id}`);
});

module.exports.delete = handleAsync(async (req,res,next) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  req.flash('success','Hotel Deleted ');
  res.redirect('/hotels');
});
