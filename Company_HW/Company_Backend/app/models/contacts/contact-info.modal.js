// 40.711230084198434, -74.00635248624224
const mongoose = require('mongoose');
const { Schema } = mongoose;
const joi = require('joi');

const contactInfoValidators = joi.object({
    address: joi.string().required(),
    lat: joi.number().required(),
    lng: joi.number().required(),
    emails: joi.array().items(joi.string().required()).min(1).required(),
    phones: joi.array().items(joi.string().required()).min(1).required(),
});

const contactInfoSchema = new Schema({
    address: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    emails: [{type: String, required: true}],
    phones: [{type: String, required: true}],
});

const contactInfoModel = mongoose.model('ContactInfo', contactInfoSchema);

module.exports = { contactInfoValidators, contactInfoModel };