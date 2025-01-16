import { Document } from "mongoose";

export interface IMovie extends Document {
    name: string;
    genre: string;
    language: string;
    duration: number; // Duration in minutes
    cast: Array<string>;
    director: string;
    releaseDate: Date;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}