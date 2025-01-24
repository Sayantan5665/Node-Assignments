import { Model, model, Schema } from "mongoose";
import joi, { object, ObjectSchema } from "joi";
import { IEnrollment } from "@interfaces";

const enrollmentValidator:ObjectSchema<IEnrollment> = object({
    student: joi.string().required(),
    course: joi.string().required(),
    batch: joi.string().required(),
    enrollmentDate: joi.date(),
    status: joi.string()
});

const enrollmentSchema: Schema<IEnrollment> = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    }
}, {timestamps: true, versionKey: false});

const enrollmentModel: Model<IEnrollment> = model('Course', enrollmentSchema);

export { enrollmentModel, enrollmentValidator };
export default enrollmentModel;