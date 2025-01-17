import { Router } from "express";
import movieController from "app/modules/movie.module/controller/api/movie.controller";
import { auth, adminAccess } from "@middlewares";

const router = Router();

router.post("/create", adminAccess, movieController.createMovie);
router.get("/fetch-all", auth, movieController.getAllMovies);
router.get("/fetch/:id", auth, movieController.getMovieById);
router.put("/update/:id", adminAccess, movieController.updateMovie);
router.delete("/delete/:id", adminAccess, movieController.deleteMovie);
router.get("/movies-with-theaters",  auth, movieController.getAllMoviesWithTheaters);
router.get('/total-bookings', auth, movieController.getMoviesWithTotalBookings);
router.get('/bookings/by-theater',auth, movieController.getBookingsByTheater);

export default router;
