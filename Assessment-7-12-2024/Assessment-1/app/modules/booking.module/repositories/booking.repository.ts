 import { IBooking } from "@interfaces";
import  { bookingModel, bookingValidator } from "../models/booking.model";
// const Theatre = require('../../theatre/models/theatre.model');
import { mailTransporter, sendVerificationEmail } from "@utils";
import theaterRepository from "app/modules/theater.module/repository/theater.repository";
const nodemailer = require("nodemailer");
const User = require('../../user/models/user.model');

class BookingRepository{
    async bookTickets(data: IBooking) {
        try {
          // Find the theater and screen where the movie is being shown
          const theater = await theaterRepository.getTheatreById(typeof data.theaterId == "string" ? data.theaterId : '');
          if (!theater) {
            throw new Error("Theater not found.");
          }
    
          // Find the screen and showTimings for the movie
          const screen = theater.screens.find(
            (screen) =>
              screen.movie.toString() === movieId.toString() &&
              screen.showTimings.includes(showTiming)
          );
          if (!screen) {
            throw new Error("Movie not playing at this showtime.");
          }
    
          // Check if there are enough available seats
          if (screen.availableSeats < numberOfTickets) {
            throw new Error("Not enough available seats.");
          }
    
          // Create the booking
          const totalPrice = numberOfTickets * movie.ticketPrice; // Assuming movie has a ticketPrice field
          const booking = new Booking({
            user: userId,
            movie: movieId,
            theater: theaterId,
            showTiming,
            numberOfTickets,
            totalPrice,
          });
    
          // Save the booking
          await booking.save();
    
          // Update the available seats for the selected screen and showtime
          screen.availableSeats -= numberOfTickets;
    
          // Save the updated theater document
          await theater.save();
    
          return booking;
        } catch (error) {
          throw new Error(`Error booking tickets: ${error.message}`);
        }
      }

    async cancelBooking(bookingId) {
        try {
          // Find the booking to cancel
          const booking = await Booking.findById(bookingId);
          if (!booking) {
            throw new Error("Booking not found.");
          }
    
          // Find the theater and screen for the booking
          const theater = await Theatre.findById(booking.theater);
          if (!theater) {
            throw new Error("Theater not found.");
          }
    
          // Find the screen and showTimings for the movie
          const screen = theater.screens.find(
            (screen) =>
              screen.movie.toString() === booking.movie.toString() &&
              screen.showTimings.includes(booking.showTiming)
          );
          if (!screen) {
            throw new Error("Screen not found for this movie and showtime.");
          }
    
          // Restore the available seats
          screen.availableSeats += booking.numberOfTickets;
    
          // Save the updated theater document
          await theater.save();
    
          // Delete the booking
          await booking.remove();
    
          return booking;
        } catch (error) {
          throw new Error(`Error canceling booking: ${error.message}`);
        }
      }
    

    async getBookingHistory(userId) {
        try {
          const bookings = await Booking.find({ user: userId })
            .populate("movie")
            .populate("theater");
    
          return bookings;
        } catch (error) {
          throw new Error(`Error fetching booking history: ${error.message}`);
        }
      }

    // Method to get all bookings for a user and send the email summary
  async sendBookingSummaryToUser(userId) {
    try {

        const user = await User.findById(userId);
        if (!user) {
        throw new Error("User not found.");
      }
      // Fetch all bookings for the user
      const bookings = await Booking.find({ user: userId })
        .populate("movie")
        .populate("theater")
        .lean(); // Convert to plain JavaScript objects for easier manipulation

      if (bookings.length === 0) {
        throw new Error("No bookings found for this user.");
      }

      // Prepare the table content for the email
      let tableContent = `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Theater Name</th>
              <th>Show Timing</th>
              <th>Number of Tickets</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>`;

      bookings.forEach((booking) => {
        tableContent += `
          <tr>
            <td>${booking.movie.name}</td>
            <td>${booking.theater.name}</td>
            <td>${new Date(booking.showTiming).toLocaleString()}</td>
            <td>${booking.numberOfTickets}</td>
            <td>${booking.totalPrice}</td>
            <td>${booking.status}</td>
          </tr>`;
      });

      tableContent += `</tbody></table>`;

      // Prepare email options
      const mailOptions = {
        from: "no-reply@yourapp.com", 
        to: user.email, 
        subject: "Your Booking Summary",
        html: `
          <h2>Booking Summary</h2>
          <p>Here is the summary of all your bookings:</p>
          ${tableContent}
          <p>Thank you for using our service!</p>
        `,
      };

      // Transport and send the email using mailSender utility
      const senderEmail = process.env.SENDER_EMAIL 
      const appPassword = process.env.APP_PASSWORD; 
      const trans = transport(senderEmail, appPassword);

      // Call the utility to send the email
      await mailSender(null, null, trans, mailOptions);

      return { message: "Booking summary sent to user." };

    } catch (error) {
      throw new Error(error.message);
    }
  }

}

module.exports = new BookingRepository();