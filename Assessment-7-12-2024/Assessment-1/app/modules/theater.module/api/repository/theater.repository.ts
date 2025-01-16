import { Types } from "mongoose";
import { theatreModel, theatreValidator } from "../model/theater.model";
import { ITheatre } from "@interfaces";

class theatreRepository {
    async createTheatre(theatreData: ITheatre): Promise<ITheatre> {
        try {
            const { error } = theatreValidator.validate(theatreData);
            if (error) throw error;
            const newTheatre = new theatreModel(theatreData);
            return await newTheatre.save();
        } catch (error: any) {
            throw error;
        }
    }

    async getAllTheatres(): Promise<Array<ITheatre>> {
        try {
            return await theatreModel.find({});
        } catch (error) {
            throw error;
        }
    }

    async getTheatreById(id: string): Promise<ITheatre | null> {
        try {
            const theater:Array<ITheatre> = await theatreModel.aggregate([
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

export default new theatreRepository();