import { Document, Types } from "mongoose";

export interface IAnswer extends Document {
    question: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    submittedAt?: Date;
    userTimezone: string;
}