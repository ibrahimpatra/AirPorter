
const joi = require('joi');

module.exports.airportSchema = joi.object({
    airport: joi.object({
        title: joi.string().required(),
        code: joi.string().required(),
        //image: joi.string().required(),
        location : joi.string().required(),
        description: joi.string().required()
    }).required(),
    deleteImages: joi.array()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required()
    }).required()
})

