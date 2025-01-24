import { Document, Types } from "mongoose";

export interface IEnrollment extends Document {
    studentId: Types.ObjectId,
    courseId: Types.ObjectId,
    batchId: Types.ObjectId,
    enrollmentDate: Date,
    status: 'active' | 'completed' | 'dropped'
  }