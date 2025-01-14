import { Types } from "mongoose";
import theatreModel from "../model/theater.model";
import { ITheater } from "@interfaces";

class TheatreRepository {
    async createTheatre(theatreData: ITheater): Promise<ITheater> {
        try {
            const newTheatre = new theatreModel(theatreData);
            return await newTheatre.save();
        } catch (error: any) {
            throw error;
        }
    }

    async getAllTheatres(): Promise<Array<ITheater>> {
        try {
            return await theatreModel.find({});
        } catch (error) {
            throw error;
        }
    }

    async getTheatreById(id: string): Promise<ITheater | null> {
        try {
            const theater:Array<ITheater> = await theatreModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(id)
                    }
                }
            ]);
            return theater.length ? theater[0] : null;
        } catch (error) {
            throw error;
        }
    }

    async assignMovieToScreen(theatreId:string, screenNumber:number, movieId:string, showTimings:Array<Date>) {
        try {
            const theatre = await theatreModel.findById(theatreId);

            if (!theatre) {
                throw new Error("theatreModel not found");
            }

            const screen = theatre.screens.find((scr:any) => scr.screenNumber === screenNumber);
            if (!screen) {
                throw new Error("Screen not found in the specified theatre");
            }

            screen.movie = new Types.ObjectId(movieId);
            screen.showTimings = showTimings;

            return await theatre.save();
        } catch (error) {
            throw error;
        }
    }

    async getTheatersForMovie(movieId:string) {
        try {
            const movieDetails = await theatreModel.aggregate([
                {
                    $unwind: "$screens",
                },
                {
                    $match: {
                        "screens.movie": new Types.ObjectId(movieId),
                    },
                },
                {
                    $project: {
                        theaterName: "$name",
                        location: "$location",
                        showTimings: "$screens.showTimings",
                    },
                },
            ]);

            return movieDetails;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TheatreRepository();
