import { Document } from "mongoose";

export interface ICourse extends Document {
    name: string,
    description: string,
    duration: number, // in months
    fees: number,
    isActive?: boolean
}
