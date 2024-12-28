const mongoose = require('mongoose');
const { Schema } = mongoose;
const joi = require('joi');

const aboutUsHomeValidator = joi.object({
    heading: joi.string().required(),
    title: joi.string().required(),
    sub_title: joi.string().required(),
    content: joi.string().required(),
    isActive: joi.boolean(),
    updated_at: joi.date()
});

const aboutUsHomeSchema = new Schema({
    heading: { type: String, required: true },
    title: { type: String, required: true },
    sub_title: { type: String, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true }
})

const aboutUsHomeModel = mongoose.model('homeaboutus', aboutUsHomeSchema);

module.exports = { aboutUsHomeValidator, aboutUsHomeModel }