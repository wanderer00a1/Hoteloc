const express = require('express');


const hotels = require('../Controllers/hotels.js')

const {isLoggedin, validateSchema, isAuthor} = require('../middleware.js');
const multer  = require('multer');
const {storage } = require('../Cloudinary')
const upload = multer({ storage })


const router = express.Router();


router.route('/')
  .get(hotels.hotelIndex)
  .post( upload.array('image'), validateSchema, hotels.createNew);
  

router.get('/new',isLoggedin, hotels.renderNew);

router.route('/:id')
  .get(hotels.show)
  .put(isLoggedin,isAuthor, upload.array('image'), validateSchema, hotels.edit )
  .delete(isLoggedin, isAuthor, hotels.delete);
  // if new is here then it will be like uk ^(order matters)
  
router.get('/:id/edit', isLoggedin, isAuthor, hotels.renderEdit);


module.exports = router;
  