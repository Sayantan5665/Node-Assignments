// const TheatreRepository = require("../../repositories/theatre.repo");
// const MovieRepository = require("../../../movie/repositories/movie.repo");

// class TheatreController {
//   async createTheatre(req, res) {
//     try {
//       const { name, location, screens } = req.body;
//       // Validate required fields
//       if (!name || !location || !screens) {
//         return res.status(400).json({ message: "All fields are required." });
//       }

//       // Prepare theatre data
//       const theatreData = {
//         name,
//         location,
//         screens,
//       };

//       const savedTheatre = await TheatreRepository.createTheatre(theatreData);
//       res.status(201).json({
//         message: "Theatre created successfully.",
//         theatre: savedTheatre,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   async getAllTheatres(req, res) {
//     try {
//         const theatres = await TheatreRepository.getAllTheatres();
//         res.json({message: "All Theatres fetched successfully!",theatre: theatres});
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
//   }

//   async getTheatreById(req, res) {
//     try {
//       const { id } = req.params;
//       const theatre = await TheatreRepository.getTheatreById(id);
//       res.status(200).json({message: 'Theatre fetched successfully!', theatre: theatre});
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }


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

//   async getTheatersForMovie(req, res) {
//     try {
//       const { movieId } = req.params;

//       // Call the repository to fetch theaters for the movie
//       const theaters = await TheatreRepository.getTheatersForMovie(movieId);

//       if (theaters.length === 0) {
//         return res.status(404).json({ message: "No theaters found for this movie." });
//       }

//       res.status(200).json({ message: "Theaters fetched successfully.", theaters });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// module.exports = new TheatreController();
