const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview, isloggedin, isreviewcreator } = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');

const reviews = require('../controllers/reviews')




router.post('/', isloggedin,validateReview, catchAsync(reviews.addreview))

router.delete('/:reviewId',isreviewcreator, isloggedin, catchAsync(reviews.deletereview))

module.exports = router;