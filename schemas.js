const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
     "string.htmlStrip": "{{#label}} should not contain any html tags"
  },
  rules: {
  htmlStrip: {
   validate(value, helpers) {
     const clean = sanitizeHtml(value, {
       allowedTags: [],
       allowedAttributes: {},
     });
     if (clean == value) {
       return clean;
     }
     return helpers.error("string.htmlStrip")
   }
 } } } ) 

const Joi = BaseJoi.extend(extension);

module.exports.hotelSchema = Joi.object({
    hotel:Joi.object({
      title:Joi.string().required().htmlStrip(),
      // image: Joi.string().required(),
      description:Joi.string().required().htmlStrip(),
      price: Joi.number().min(0).required().messages({
        'number.min': 'Price must be a positive number',
        'number.base': 'Price must be a number'
      }),
      location:Joi.string().required().htmlStrip()
    }).required(),
    deleteImages:Joi.array()
  })



module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    body:Joi.string().required().htmlStrip()
  }).required()
})