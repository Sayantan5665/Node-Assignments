import { Document, Types } from "mongoose";

export interface ITask extends Document {
    userId: Types.ObjectId;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    due: {
        date: Date,
        time: string
    }
    categoryId: Types.ObjectId;
    labels?: Array<Types.ObjectId>;
    order: number;
    status: 'pending' | 'complete';
    location?: string;
    isActive: boolean;
}

export interface ICategory extends Document {
    title: string;
    description: string;
    isActive: boolean;
}

export interface IReminder extends Document {
    userId: Types.ObjectId;
    taskId: Types.ObjectId;
    type: 'no repeat' | 'every week' | 'every month' | 'every year';
    remindBefore: number; //in minutes
}

export interface ILabel extends Document {
    title: string;
    description: string;
    color: string;
    isActive: boolean;
}