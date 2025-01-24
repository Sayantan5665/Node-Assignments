import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ICourse } from "@interfaces";

const courseValidator:ObjectSchema<ICourse> = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    duration: joi.number().required(),
    fees: joi.number().required(),
    isActive: joi.boolean()
});

const courseSchema: Schema<ICourse> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {  // in months
        type: Number,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const courseModel: Model<ICourse> = model('Course', courseSchema);

export { courseModel, courseValidator };
export default courseModel;