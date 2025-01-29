import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ITask } from "@interfaces";


const taskValidator: ObjectSchema<ITask> = joi.object({
    userId: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required(),
    priority: joi.string().required(),
    due: joi.object({
        date: joi.date().required(),
        time: joi.string().required()
    }).required(),
    categoryId: joi.string().required(),
    labels: joi.array().items(joi.string()),
    order: joi.number(),
    status: joi.string(),
    location: joi.string(),
    color: joi.string(),
    isActive: joi.boolean()
});

const taskSchema: Schema<ITask> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    priority: {
        type: String, 
        enum: ['low','medium','high'],
        default: 'medium',
        required: true
    },
    due: {
        date: {type: Date, required: true},
        time: {type: String, required: true}
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    order: {
        type: Number
    },  
    status: {
        type: String, 
        enum: ['pending','complete'],
        default: 'pending'
    },
    location: {
        type: String
    },
    isActive: {
        type: Boolean, 
        default: true
    }
}, { timestamps: true, versionKey: false });

const taskModel: Model<ITask> = model('Task', taskSchema);

export { taskModel, taskValidator };
export default taskModel;