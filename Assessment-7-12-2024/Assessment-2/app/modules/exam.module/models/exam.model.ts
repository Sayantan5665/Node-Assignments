import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IExam } from "@interfaces";

const examValidator:ObjectSchema<IExam> = joi.object({
    name: joi.string().required(),
    batch: joi.string().required(),
    date: joi.date().required(),
    duration: joi.number().required(), // in minutes,
    totalMarks: joi.number().required(),
    passingMarks: joi.number().required(),
    results: joi.array().items(joi.object({
        student: joi.string().required(),
        marks: joi.number().required()
    })).required()
});

const examSchema: Schema<IExam> = new Schema({
    name: {
        type: String,
        required: true
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    duration: {
        type: Number,
        required: true
    }, // in minutes,
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    results: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        marks: {
            type: Number,
            required: true
        }
    }]
}, {timestamps: true, versionKey: false});

const examModel: Model<IExam> = model('Exam', examSchema);

export { examModel, examValidator };
export default examModel;