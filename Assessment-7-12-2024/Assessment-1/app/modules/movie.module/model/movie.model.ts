import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IMovie } from "@interfaces";

const movieValidator: ObjectSchema<IMovie> = joi.object({
    name: joi.string().required(),
    genre: joi.string().required(),
    language: joi.string().required(),
    duration: joi.number().required(),
    cast: joi.array().items(joi.string()).required(),
    director: joi.string().required(),
    releaseDate: joi.date().required(),
    ticketPrice: joi.number().required(),
    isActive: joi.boolean(),
});

const movieSchema: Schema<IMovie> = new Schema({
    name: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    cast: {
        type: [String],
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
}, { timestamps: true, versionKey: false });

const movieModel: Model<IMovie> = model<IMovie>("Movie", movieSchema);

export { movieModel, movieValidator };
export default movieModel;