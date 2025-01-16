const BookingRepository = require("../../repositories/booking.repo");

class BookingController {
    async bookTickets(req, res) {
        try {
          const { userId } = req.user;
          const { movieId } = req.params;
          const { theaterId, showTiming, numberOfTickets } = req.body;
    
          // Call the repository to book tickets
          const booking = await BookingRepository.bookTickets(
            userId,
            movieId,
            theaterId,
            showTiming,
            numberOfTickets
          );
    
          res
            .status(200)
            .json({ message: "Tickets booked successfully.", booking });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    
      async cancelBooking(req, res) {
        try {
          const { bookingId } = req.params;
    
          // Call the repository to cancel the booking
          const cancelledBooking = await BookingRepository.cancelBooking(bookingId);
    
          res
            .status(200)
            .json({ message: "Booking cancelled successfully.", booking: cancelledBooking });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    
      async getBookingHistory(req, res) {
        try {
          const { userId } = req.user;
    
          // Call the repository to get booking history
          const bookings = await BookingRepository.getBookingHistory(userId);
    
          if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user." });
          }
    
          res.status(200).json({ message: "Booking history fetched successfully.", bookings });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      async sendBookingSummary(req, res) {
        try {
          const { userId } = req.user; // Assuming userId is available in the JWT payload
    
          // Call the repository to send booking summary to the user
          const result = await BookingRepository.sendBookingSummaryToUser(userId);
    
          res.status(200).json({ message: result.message });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
}

module.exports = new BookingController();
