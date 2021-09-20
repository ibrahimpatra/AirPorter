const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const AirportSchema = new Schema({
    title: String,
    images:[{
        url: String,
        filename: String

    }],
    code: String,
    // image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

AirportSchema.post('findOneAndDelete', async function(doc){
    if (doc){
        await Review.remove({
           _id: {
               $in: doc.reviews
           } 
        })
    }
})

module.exports = mongoose.model('Airport', AirportSchema)