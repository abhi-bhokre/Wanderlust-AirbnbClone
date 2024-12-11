const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(), // Fixed required()
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        Comment: Joi.string().required(), // comment required hai
        rating: Joi.number().min(0).max(5).required(), // rating 0-5 ke beech hona chahiye
    }).required(), // review object required hai
});