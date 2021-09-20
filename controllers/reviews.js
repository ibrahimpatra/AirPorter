const Review = require('../models/review');
const Airport = require('../models/airports');


module.exports.addreview = async( req, res ) => {
    //res.send('Reviews')
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    review.creator = req.user._id;
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    req.flash('success', 'Created new review');
    res.redirect(`/airports/${airport._id}`);
}

module.exports.deletereview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Airport.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/airports/${id}`);
}