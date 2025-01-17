import { Router } from 'express';
import bookingController from '../../modules/booking.module/controllers/api/booking.controller';
import { auth } from '@middlewares';

const router = Router();

router.post('/create/:movieId', auth, bookingController.bookTickets);
router.delete('/cancel/:bookingId', auth, bookingController.cancelBooking);
router.get('/history', auth, bookingController.getBookingHistory);
router.post("/get-summary", auth, bookingController.sendBookingSummary);

export default router;