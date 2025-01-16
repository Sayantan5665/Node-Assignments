import { Document, Types } from "mongoose";

export interface ITheatre extends Document {
    name: string;
    location: string;
    screens: Array<IScreen>;
}

export interface IScreen extends Document {
    screenNumber: number;
    movie: Types.ObjectId;
    showTimings: Array<Date>;
    availableSeats: number;
}