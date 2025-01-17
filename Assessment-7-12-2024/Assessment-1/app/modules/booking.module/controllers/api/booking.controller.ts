import { Request, Response } from "express";
import bookingRepository from "../../repositories/booking.repository";

class bookingController {
  async bookTickets(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      const { movieId } = req.params;
      const body = { ...req.body };
      body.userId = userId;
      body.movieId = movieId;

      const booking = await bookingRepository.bookTickets(body);

      res.status(200).json({
        status: 200,
        message: "Tickets booked successfully.",
        booking
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to book tickets.",
        error
      });
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<any> {
    try {
      const { bookingId } = req.params;
      const cancelledBooking = await bookingRepository.cancelBooking(bookingId);

      res.status(200).json({
        status: 200,
        message: "Booking cancelled successfully.",
        booking: cancelledBooking
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to cancel booking.",
        error
      });
    }
  }

  async getBookingHistory(req: Request, res: Response): Promise<any> {
    try {
      const userId = req.user?.id || '';
      const bookings = await bookingRepository.getBookingHistory(userId);

      if (bookings.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No bookings found for this user."
        });
      }

      res.status(200).json({
        status: 200,
        message: "Booking history fetched successfully.",
        bookings
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to fetch booking history.",
        error
      });
    }
  }

  async sendBookingSummary(req:Request, res:Response): Promise<any>{
    try {
      const userId = req.user?.id || '';

      // Call the repository to send booking summary to the user
      await bookingRepository.sendBookingSummaryToUser(userId);
      res.status(200).json({ 
        status:200, 
        message: 'Booking summary sent to your email address.' 
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to send booking summary.',
        error: error,
      });
    }
  }
}

export default new bookingController();
