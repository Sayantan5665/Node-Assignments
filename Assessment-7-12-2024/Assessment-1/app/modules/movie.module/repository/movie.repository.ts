import { IMovie } from "@interfaces";
import { movieModel, movieValidator } from "../model/movie.model";
// const Booking = require('../../booking/models/booking.model');

class movieRepository {
    async createMovie(movieData: IMovie): Promise<IMovie> {
        try {
            const { error } = movieValidator.validate(movieData);
            if (error) throw error;
            const newMovie = new movieModel(movieData);
            return await newMovie.save();
        } catch (error) {
            throw error;
        }
    }

    async getAllMovies(): Promise<IMovie[]> {
        try {
            return await movieModel.find();
        } catch (error) {
            throw error;
        }
    }

    async getMovieById(id: string): Promise<IMovie | null> {
        try {
            return await movieModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateMovie(id: string, updateData: IMovie): Promise<IMovie | null> {
        try {
            return await movieModel.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteMovie(id: string): Promise<IMovie | null> {
        try {
            return await movieModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async getAllMoviesWithTheaters(): Promise<IMovie[]> {
        try {
            const movieDetails: Array<IMovie> = await movieModel.aggregate([
                {
                    $lookup: {
                        from: "theatres",
                        localField: "_id",
                        foreignField: "screens.movie",
                        as: "theaters",
                    },
                },
                {
                    $unwind: "$theaters",
                },
                {
                    $match: {
                        "theaters.screens.movie": { $ne: null },
                    },
                },
                {
                    $project: {
                        movieId: "$_id",
                        name: 1,
                        genre: 1,
                        language: 1,
                        releaseDate: 1,
                        totalTheaters: { $size: "$theaters" },
                        theaters: {
                            name: "$theaters.name",
                            location: "$theaters.location",
                            showTimings: "$theaters.screens.showTimings",
                        },
                    },
                },
            ]);

            return movieDetails;
        } catch (error) {
            throw error;
        }
    }

    //   async getMoviesWithTotalBookings() {
    //     try {
    //       const movieBookings = await Booking.aggregate([
    //         {
    //           $group: {
    //             _id: "$movie", // Group by movie ID
    //             totalBookings: { $sum: "$numberOfTickets" }, // Sum total tickets booked
    //           },
    //         },
    //         {
    //           $lookup: {
    //             from: "movies",
    //             localField: "_id",
    //             foreignField: "_id",
    //             as: "movieDetails",
    //           },
    //         },
    //         {
    //           $unwind: "$movieDetails",
    //         },
    //         {
    //           $project: {
    //             movieId: "$_id",
    //             movieName: "$movieDetails.name",
    //             totalBookings: 1,
    //           },
    //         },
    //       ]);
    //       return movieBookings;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }

    // List of bookings by theater
    //   async getBookingsByTheater() {
    //     try {
    //       const bookingsByTheater = await Booking.aggregate([
    //         {
    //           $lookup: {
    //             from: "theatres",
    //             localField: "theater",
    //             foreignField: "_id",
    //             as: "theaterDetails",
    //           },
    //         },
    //         {
    //           $unwind: "$theaterDetails",
    //         },
    //         {
    //           $group: {
    //             _id: "$theater", // Group by theater ID
    //             totalTickets: { $sum: "$numberOfTickets" }, // Total tickets booked for each theater
    //             movies: { $push: { movie: "$movie", showTiming: "$showTiming", numberOfTickets: "$numberOfTickets" } },
    //           },
    //         },
    //         {
    //           $lookup: {
    //             from: "movies",
    //             localField: "movies.movie",
    //             foreignField: "_id",
    //             as: "moviesDetails",
    //           },
    //         },
    //         {
    //           $unwind: "$moviesDetails",
    //         },
    //         {
    //           $project: {
    //             theaterName: "$theaterDetails.name",
    //             theaterLocation: "$theaterDetails.location",
    //             movies: 1,
    //             totalTickets: 1,
    //           },
    //         },
    //       ]);
    //       return bookingsByTheater;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
}

export default new movieRepository();
