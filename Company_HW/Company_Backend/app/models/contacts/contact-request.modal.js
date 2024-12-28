const mongoose = require('mongoose');
const { Schema } = mongoose;
const joi = require('joi');


const contactRequestValidator = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    subject: joi.string().required(),
    message: joi.string().required()
})

const contactRequestSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },

},{timestamps: true} );

module.exports = {
    contactRequestModel: mongoose.model('ContactRequest', contactRequestSchema),
    contactRequestValidator
}