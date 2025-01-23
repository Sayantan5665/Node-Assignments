import { Document, Types } from "mongoose";

export interface IExam extends Document {
    name: string,
    batch: Types.ObjectId,
    date: Date,
    duration: number, // in minutes,
    totalMarks: number,
    results: Array<{ student: Types.ObjectId, marks: number }>
}