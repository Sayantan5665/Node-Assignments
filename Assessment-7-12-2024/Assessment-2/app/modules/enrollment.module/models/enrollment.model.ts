import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IEnrollment } from "@interfaces";

const enrollmentValidator:ObjectSchema<IEnrollment> = joi.object({
    studentId: joi.string().required(),
    courseId: joi.string().required(),
    batchId: joi.string().required(),
    enrollmentDate: joi.date(),
    status: joi.string()
});

const enrollmentSchema: Schema<IEnrollment> = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    batchId: {
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