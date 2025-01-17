import { Router } from 'express';
import theaterController from 'app/modules/theater.module/controller/api/theater.controller';
import { auth, adminAccess } from '@middlewares';

const router = Router();

router.post('/creater',adminAccess, theaterController.createTheatre);
router.get('/fetch-all', auth, theaterController.getAllTheatres);
router.get('/fetch/:id', auth,theaterController.getTheatreById);
router.post("/assign-movie-to-screen", adminAccess, theaterController.assignMovieToScreen);
router.get('/theatre-for-movie/:movieId', auth, theaterController.getTheatersForMovie);

export default router;