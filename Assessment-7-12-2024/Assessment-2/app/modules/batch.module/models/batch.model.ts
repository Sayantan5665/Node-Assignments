import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IBatch } from "@interfaces";

const batchValidator:ObjectSchema<IBatch> = joi.object({
    name: joi.string().required(),
    courseId: joi.string().required(),
    teacherId: joi.string().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    students: joi.array().items(joi.string()),
    isActive: joi.boolean()
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
    teacherId: {
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
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

const batchModel: Model<IBatch> = model('Batch', batchSchema);

export { batchModel, batchValidator };
export default batchModel;