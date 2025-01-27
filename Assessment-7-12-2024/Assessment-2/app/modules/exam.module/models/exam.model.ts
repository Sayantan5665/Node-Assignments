import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IExam } from "@interfaces";

const examValidator:ObjectSchema<IExam> = joi.object({
    name: joi.string().required(),
    batchId: joi.string().required(),
    date: joi.date().required(),
    duration: joi.number().required(), // in minutes,
    totalMarks: joi.number().required(),
    passingMarks: joi.number().required(),
    results: joi.array().items(joi.object({
        studentId: joi.string().required(),
        marks: joi.number().required()
    }))
});

const examSchema: Schema<IExam> = new Schema({
    name: {
        type: String,
        required: true
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
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
        studentId: {
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