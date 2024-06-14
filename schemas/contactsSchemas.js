const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/).required()
});

const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
}).min(1).messages({
    'object.min': 'Body must have at least one field'
});

module.exports = {
    contactSchema,
    updateContactSchema
};
