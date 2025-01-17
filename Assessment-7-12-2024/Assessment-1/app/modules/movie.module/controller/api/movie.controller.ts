import { Request, Response } from "express";
import movieRepository from "../../repository/movie.repository";
import { IMovie } from "@interfaces";

class movieController {
    async createMovie(req: Request, res: Response): Promise<any> {
        try {
            const savedMovie: IMovie = await movieRepository.createMovie(req.body);

            res.status(200).json({
                status: 200,
                message: "Movie created successfully",
                movie: savedMovie
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to create movie",
                error
            });
        }
    }

    async getAllMovies(req: Request, res: Response): Promise<any> {
        try {
            const movies: IMovie[] = await movieRepository.getAllMovies();
            res.status(200).json({
                status: 200,
                message: "All movies fetched successfully!",
                movie: movies
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch all movies",
                error
            });
        }
    }

    async getMovieById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const movie: IMovie | null = await movieRepository.getMovieById(id);
            if (!movie) {
                return res.status(404).json({ message: "Movie not found." });
            }
            res.status(200).json({
                status: 200,
                message: "Movie fetched successfully!",
                movie
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch movie by ID",
                error
            });
        }
    }

    async updateMovie(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const updatedMovie: IMovie | null = await movieRepository.updateMovie(id, req.body);

            res.status(200).json({
                status: 200,
                message: "Movie updated successfully!",
                movie: updatedMovie
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to update movie",
                error
            });
        }
    }

    async deleteMovie(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const deletedMovie: IMovie | null = await movieRepository.deleteMovie(id);
            if (!deletedMovie) {
                return res.status(404).json({
                    status: 404,
                    message: "Movie not found."
                });
            }
            res.status(200).json({
                status: 200,
                message: "Movie deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to delete movie",
                error
            });
        }
    }

    async getAllMoviesWithTheaters(req: Request, res: Response): Promise<any> {
        try {
            const movieDetails: IMovie[] = await movieRepository.getAllMoviesWithTheaters();

            if (!movieDetails || movieDetails.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "No movies found with associated theaters."
                });
            }

            res.status(200).json({
                status: 200,
                message: "Movies with theaters fetched successfully!",
                movies: movieDetails,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch movies with theaters",
                error
            });
        }
    }

    async getMoviesWithTotalBookings(req:Request, res:Response): Promise<any> {
        try {
            const movies = await movieRepository.getMoviesWithTotalBookings();
            res.status(200).json({ 
                status: 200,
                message: "Movies with total bookings fetched successfully.", 
                movies 
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch movies with total bookings",
                error
            });
        }
    }

    async getBookingsByTheater(req:Request, res:Response): Promise<any> {
        try {
            const bookings = await movieRepository.getBookingsByTheater();
            res.status(200).json({ status: 200,
                message: "Bookings by theater fetched successfully.", 
                bookings 
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch bookings by theater",
                error
            });
        }
    }
}

export default new movieController();
