import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IBatch } from "@interfaces";

const batchValidator:ObjectSchema<IBatch> = joi.object({
    name: joi.string().required(),
    course: joi.string().required(),
    teacher: joi.string().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    students: joi.array().items(joi.string()).required()
});

const batchSchema: Schema<IBatch> = new Schema({
    name: {
        type: String,
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true, versionKey: false});

const batchModel: Model<IBatch> = model('Batch', batchSchema);

export { batchModel, batchValidator };
export default batchModel;