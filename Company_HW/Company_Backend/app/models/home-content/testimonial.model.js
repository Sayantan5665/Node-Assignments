const mongoose = require('mongoose');
const { Schema } = mongoose;

const joi = require('joi');

const testimonialValidator = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    designation: joi.string().required(),
    content: joi.string().required(),
    updated_at: joi.date()
});

const testimonialSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    designation: { type: String, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true }
});

const testimonialModel = mongoose.model('testimonial', testimonialSchema);

module.exports = { testimonialModel, testimonialValidator };