const {airportSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Airport = require('./models/airports');
const Review = require('./models/review');


module.exports.isloggedin = (req, res, next) => {
    // console.log("Req.user...",req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You Must Be Logged In')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateairport = (req, res, next) => {
    
    const { error } = airportSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw  new ExpressError(msg, 400)
    } else {
        next()
    }
    // console.log(result)
}

module.exports.iscreator = async (req, res, next) => {
    const {id} = req.params;
    const airport = await Airport.findById(id);
    if(!airport.creator.equals(req.user._id)){
        req.flash('error', 'You dont have the permission.')
        return res.redirect(`/airports/${id}`)
    }
    next();
}

module.exports.isreviewcreator = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.creator.equals(req.user._id)){
        req.flash('error', 'You dont have the permission.')
        return res.redirect(`/airports/${id}`)
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}
