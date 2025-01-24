import { IAttendance } from "@interfaces";
import { Model, model, Schema } from "mongoose";
import joi, { object, ObjectSchema } from "joi";

const attendanceValidator:ObjectSchema<IAttendance> = object({
    batch: joi.string().required(),
    date: joi.date().required(),
    records: joi.array().items(joi.object({
        student: joi.string().required(),
        status: joi.string().valid('present', 'absent').required()
    })).required(),
    markedBy: joi.string().required()
});

const attendanceSchema: Schema<IAttendance> = new Schema({
    batch: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    records: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true
        }
    }],
    markedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true, versionKey: false});

const attendanceModel: Model<IAttendance> = model('Attendance', attendanceSchema);

export { attendanceModel, attendanceValidator };
export default attendanceModel;