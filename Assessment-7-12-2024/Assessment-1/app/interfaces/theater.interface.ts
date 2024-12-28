import { Document, Types } from "mongoose";

export interface ITheater extends Document {
    name: string;
    location: string;
    screens: Array<IScreen>;
}

export interface IMovie extends Document {
    name: string;
    genre: string;
    language: string;
    duration: number;
    cast: Array<string>;
    director: string;
    releaseDate: Date;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IScreen extends Document {
    screenNumber: number;
    movie: Types.ObjectId;
    showTimings: Array<Date>;
    availableSeats: number;
}

export interface IBooking extends Document {
    userId: Types.ObjectId;
    movieId: Types.ObjectId;
    theaterId: Types.ObjectId;
    showTimings: Date;
    numberOfTickets: number;
    price: number;
    status: 'booked' | 'cancelled' | 'used';
    createdAt?: string;
    updatedAt?: string;
}