const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true , index: true },
    expires: { type: Date, default: Date.now, index: { expires: 86400000 } },
})

module.exports = mongoose.model('Token', tokenSchema);