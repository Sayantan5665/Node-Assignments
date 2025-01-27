import { Document, Types } from "mongoose";

export interface IExam extends Document {
    name: string,
    batchId: Types.ObjectId,
    date: Date,
    duration: number, // in minutes,
    totalMarks: number,
    passingMarks: number,
    results: Array<{ studentId: Types.ObjectId, marks: number }>
}