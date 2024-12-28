import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ITheater, IScreen } from "@interfaces";

const screenSchema: Schema<IScreen> = new Schema<IScreen>({
    screenNumber: {
        type: Number,
        required: true,
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
    },
    showTimings: {
        type: [Date],
        default: [],
    },
    availableSeats: {
        type: Number,
        required: true,
    },
});

const theaterValidator: ObjectSchema<ITheater> = joi.object({
    name: joi.string().required(),
    location: joi.string().required(),
    screens: joi.array().items().required(),
});

const theaterSchema: Schema<ITheater> = new Schema({
    name: { type: "String" },
    location: { type: "String" },
    screens: { type: [screenSchema] }
}, { timestamps: true, versionKey: false });

const theaterModel: Model<ITheater> = model<ITheater>("Theater", theaterSchema);

export { theaterModel, theaterValidator };
export default theaterModel;