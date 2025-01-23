import { Document, Types } from "mongoose";

export interface IEnrollment extends Document {
    student: Types.ObjectId,
    course: Types.ObjectId,
    batch: Types.ObjectId,
    enrollmentDate: Date,
    status: 'active' | 'completed' | 'dropped'
  }