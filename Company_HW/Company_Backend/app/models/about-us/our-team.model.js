const mongoose = require('mongoose');
const { Schema } = mongoose;
const joi = require('joi');


const ourTeamValidator = joi.object({
    description: joi.string().required(),
    teamMembers: joi.array().items(joi.string())
});
const ourTeamschema = new Schema({
    description: { type: 'string' },
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'teamMember'
    }]
});
const ourTeamModel = mongoose.model('ourTeam', ourTeamschema);


const teamMemberValidator = joi.object({
    image: joi.string().required(),
    name: joi.string().min(2).max(30).required(),
    designation: joi.string().required(),
    twitter_link: joi.string().required(),
    facebook_link: joi.string().required(),
    instagram_link: joi.string().required(),
    linkedin_link: joi.string().required(),
    isActive: joi.boolean(),
    updated_at: joi.date()
});
const teamMemberSchema = new Schema({
    image: { type: String },
    name: { type: String },
    designation: { type: String },
    twitter_link: { type: String },
    facebook_link: { type: String },
    instagram_link: { type: String },
    linkedin_link: { type: String },
    isActive: { type: Boolean, default: false, index: true },
    created_at: { type: Date, default: Date.now, index: true },
    updated_at: { type: Date, default: Date.now, index: true }
})
const teamMemberModel = mongoose.model('teamMember', teamMemberSchema);

module.exports = { teamMemberValidator, ourTeamValidator, teamMemberModel, ourTeamModel }