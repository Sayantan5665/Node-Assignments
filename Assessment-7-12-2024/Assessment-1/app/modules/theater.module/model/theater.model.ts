import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ITheatre, IScreen } from "@interfaces";

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

const theatreValidator: ObjectSchema<ITheatre> = joi.object({
    name: joi.string().required(),
    location: joi.string().required(),
    screens: joi.array().items().required(),
});

const theatreSchema: Schema<ITheatre> = new Schema({
    name: { type: "String" },
    location: { type: "String" },
    screens: { type: [screenSchema] }
}, { timestamps: true, versionKey: false });

const theatreModel: Model<ITheatre> = model<ITheatre>("Theatre", theatreSchema);

export { theatreModel, theatreValidator };
export default theatreModel;