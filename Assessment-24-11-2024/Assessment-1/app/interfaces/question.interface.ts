import { Document, Types } from "mongoose";

export interface IQuestion extends Document {
    title: string;
    categories: Types.ObjectId[];
    createdBy: Types.ObjectId;
}