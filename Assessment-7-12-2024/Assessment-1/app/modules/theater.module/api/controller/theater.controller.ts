import { Request, Response } from "express";
import theatreRepository from "../repository/theater.repository";
import { ITheatre } from "@interfaces";
// import MovieRepository from "../../../movie/repositories/movie.repo";

class TheatreController {
    async createTheatre(req: Request, res: Response) {
        try {
            const savedTheatre: ITheatre = await theatreRepository.createTheatre(req.body);
            res.status(200).json({
                status: 200,
                message: "Theatre created successfully.",
                data: savedTheatre,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to create theatre.",
                error: error,
            });
        }
    }

    async getAllTheatres(req: Request, res: Response) {
        try {
            const theatres = await theatreRepository.getAllTheatres();
            res.json({ 
                status: 200, 
                message: "Successfully fetched all theatres!", 
                theatre: theatres });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch all theatres.",
                error: error,
            });
        }
    }

    async getTheatreById(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const theatre = await theatreRepository.getTheatreById(id);
            res.status(200).json({
                status:200,
                message: 'Theatre fetched successfully!', 
                theatre: theatre 
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch theatre.",
                error: error,
            });
        }
    }


    //   async assignMovieToScreen(req, res) {
    //     try {
    //       const { theatreId, screenNumber, movieId, showTimings } = req.body;

    //       // Validate required fields
    //       if (!theatreId || !screenNumber || !movieId || !showTimings) {
    //         return res.status(400).json({ message: "All fields are required." });
    //       }

    //       // Validate movie existence
    //       const movie = await MovieRepository.getMovieById(movieId);
    //       if (!movie) {
    //         return res.status(404).json({ message: "Movie not found." });
    //       }

    //       // Assign the movie to the specified screen in the theater
    //       const updatedTheatre = await TheatreRepository.assignMovieToScreen(
    //         theatreId,
    //         screenNumber,
    //         movieId,
    //         showTimings
    //       );

    //       res.status(200).json({
    //         message: "Movie assigned to screen successfully.",
    //         theatre: updatedTheatre,
    //       });
    //     } catch (error) {
    //       res.status(500).json({ message: error.message });
    //     }
    //   }

    async getTheatersForMovie(req:Request, res:Response) {
        try {
            const { movieId } = req.params;

            const theaters = await theatreRepository.getTheatersForMovie(movieId);

            if (theaters.length === 0) {
                return res.status(404).json({
                    status:404,
                    message: "No theaters found for this movie."
                });
            }

            res.status(200).json({
                status:200, 
                message: "Theaters fetched successfully.", 
                theaters
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to fetch theaters for the movie.",
                error: error,
            });
        }
    }
}

module.exports = new TheatreController();
