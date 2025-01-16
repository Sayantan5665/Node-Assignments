import { Document, Types } from "mongoose";

export interface IBooking extends Document {
    userId: Types.ObjectId;
    movieId: Types.ObjectId;
    theaterId: Types.ObjectId | string;
    showTimings: Date;
    numberOfTickets: number;
    price: number;
    status: 'booked' | 'cancelled' | 'used';
    createdAt?: string;
    updatedAt?: string;
}