import { Request, Response } from "express";
import theatreRepository from "../../repository/theater.repository";
import { ITheatre } from "@interfaces";
import movieRepository from "app/modules/movie.module/repository/movie.repository";
// import MovieRepository from "../../../movie/repositories/movie.repo";

class theatreController {
    async createTheatre(req: Request, res: Response):Promise<any> {
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

    async getAllTheatres(req: Request, res: Response):Promise<any> {
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

    async getTheatreById(req:Request, res:Response):Promise<any> {
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


      async assignMovieToScreen(req:Request, res:Response):Promise<any> {
        try {
          const { theatreId, screenNumber, movieId, showTimings } = req.body;

          if (!theatreId || !screenNumber || !movieId || !showTimings) {
            return res.status(400).json({ message: "All fields are required." });
          }

          const movie = await movieRepository.getMovieById(movieId);
          if (!movie) {
            return res.status(404).json({ message: "Movie not found." });
          }

          const updatedTheatre = await theatreRepository.assignMovieToScreen(
            theatreId,
            screenNumber,
            movieId,
            showTimings
          );

          res.status(200).json({
            status: 200,
            message: "Movie assigned to screen successfully.",
            theatre: updatedTheatre,
          });
        } catch (error) {
          res.status(500).json({
            status: 500,
            message: "Failed to assign movie to screen.",
            error: error,
          });
        }
      }

    async getTheatersForMovie(req:Request, res:Response):Promise<any> {
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

export default new theatreController();
