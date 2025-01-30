import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IReminder } from "@interfaces";


const reminderValidator: ObjectSchema<IReminder> = joi.object({
    userId: joi.string().required(),
    taskId: joi.string().required(),
    type: joi.string().required(),
    remindBefore: joi.number().required(),  //in minutes
    isActive: joi.boolean()
});

const reminderSchema: Schema<IReminder> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    type: {
        type: String,
        enum: ['no repeat', 'every week', 'every month', 'every year'],
        required: true
    },
    remindBefore: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

const reminderModel: Model<IReminder> = model('Reminder', reminderSchema);

export { reminderModel, reminderValidator };
export default reminderModel;