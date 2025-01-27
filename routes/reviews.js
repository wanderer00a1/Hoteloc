const express = require('express');

const reviews = require('../Controllers/reviews.js')

const { validateReviews,isLoggedin, reviewAuthor } = require('../middleware.js');

const router = express.Router({mergeParams: true});



//Adding the Reviews
router.post('/',isLoggedin, validateReviews, reviews.createReview)
  
router.delete('/:reviewID', isLoggedin, reviewAuthor, reviews.deleteReview);

module.exports = router;