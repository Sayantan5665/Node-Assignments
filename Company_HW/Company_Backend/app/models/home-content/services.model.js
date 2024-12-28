const mongoose = require('mongoose');
const { Schema } = mongoose;

const joi = require('joi');

serviceValidator = joi.object({
    image: joi.string().required(),
    hover_color: joi.string().required(),
    heading: joi.string().required(),
    content: joi.string().required(),
    isActive: joi.boolean(),
    updated_at: joi.date()
})

const serviceSchema = new Schema({
    image: { type: 'string' },
    hover_color: { type: 'string' },
    heading: { type: 'string' },
    content: { type: 'string' },
    isActive: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true }
});

const serviceModel = mongoose.model('Service', serviceSchema);

module.exports = { serviceModel, serviceValidator };