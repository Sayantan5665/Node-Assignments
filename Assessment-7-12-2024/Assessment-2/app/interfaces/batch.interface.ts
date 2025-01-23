import { Document, Types } from "mongoose";

export interface IBatch extends Document {
    name: string,
    course: Types.ObjectId,
    teacher: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    students: Array<Types.ObjectId>
}