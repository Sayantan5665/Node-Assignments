import { IAttendance } from "@interfaces";
import { Model, model, Schema } from "mongoose";
import joi, { ObjectSchema } from "joi";

const attendanceValidator:ObjectSchema<IAttendance> = joi.object({
    batchId: joi.string().required(),
    date: joi.date(),
    records: joi.array().items(joi.object({
        student: joi.string().required(),
        status: joi.string().valid('present', 'absent').required()
    })).required(),
    markedBy: joi.string().required(),
    uniqueId: joi.string().required()
});

const attendanceSchema: Schema<IAttendance> = new Schema({
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
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
    },
    uniqueId: {
        type: String,
        required: true
    }
}, {timestamps: true, versionKey: false});

const attendanceModel: Model<IAttendance> = model('Attendance', attendanceSchema);

export { attendanceModel, attendanceValidator };
export default attendanceModel;