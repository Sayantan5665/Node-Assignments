import { Document, Types } from "mongoose";

export interface IAttendance extends Document {
    batchId: Types.ObjectId,
    date: Date,
    records: Array<{ student: Types.ObjectId, status: 'present' | 'absent' }>,
    markedBy: Types.ObjectId,
    uniqueId: string
}