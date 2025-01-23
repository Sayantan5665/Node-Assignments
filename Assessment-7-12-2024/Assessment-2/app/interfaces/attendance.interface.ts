import { Document, Types } from "mongoose";

export interface IAttendance extends Document {
    batch: Types.ObjectId,
    date: Date,
    records: Array<{ student: Types.ObjectId, status: 'present' | 'absent' }>,
    markedBy: Types.ObjectId
}