const mongoose = require('mongoose');
const { Schema } = mongoose;
const joi = require('joi');

const bannerValidator = joi.object({
    image: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    isActive: joi.boolean(),
    updated_at: joi.date()
});

const bannerSchema = new Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true }
})

const bannerModel = mongoose.model('banner', bannerSchema);

module.exports = { bannerValidator, bannerModel }