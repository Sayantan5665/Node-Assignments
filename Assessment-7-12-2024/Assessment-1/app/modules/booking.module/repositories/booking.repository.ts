import { Types } from "mongoose";
import { IBooking, IMovie, ITheatre } from "@interfaces";
import { sendVerificationEmail } from "@utils";
import { bookingModel } from "../models/booking.model";
import theaterRepository from "app/modules/theater.module/repository/theater.repository";
import movieRepository from "app/modules/movie.module/repository/movie.repository";
import userRepositories from "app/modules/user.module/repositories/user.repositories";

class bookingRepository {
  async bookTickets(data: IBooking): Promise<IBooking> {
    try {
      const theater: ITheatre | null = await theaterRepository.getTheatreById(typeof data.theaterId == "string" ? data.theaterId : '');
      if (!theater) {
        throw new Error("Theater not found.");
      }

      const movie: IMovie | null = await movieRepository.getMovieById(data.movieId.toString());
      if (!movie) {
        throw new Error("Movie not found.");
      }

      const screen = theater.screens.find(
        (screen) =>
          screen.movie.toString() === data.movieId.toString() &&
          screen.showTimings.includes(data.showTimings)
      );
      if (!screen) {
        throw new Error("Movie not playing at this showtime.");
      }

      if (screen.availableSeats < data.numberOfTickets) {
        throw new Error("Not enough available seats.");
      }

      const totalPrice = data.numberOfTickets * movie.ticketPrice;
      data.price = totalPrice;
      const booking = new bookingModel(data);
      await booking.save();

      screen.availableSeats -= data.numberOfTickets;
      await theater.save();

      return booking;
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(bookingId: string): Promise<IBooking> {
    try {
      const booking: IBooking | null = await bookingModel.findById(bookingId);
      if (!booking) {
        throw new Error("bookingModel not found.");
      }

      const theater = await theaterRepository.getTheatreById(booking.theaterId.toString());
      if (!theater) {
        throw new Error("Theater not found.");
      }

      const screen = theater.screens.find(
        (screen) =>
          screen.movie.toString() === booking.movieId.toString() &&
          screen.showTimings.includes(booking.showTimings)
      );
      if (!screen) {
        throw new Error("Screen not found for this movie and showtime.");
      }

      await bookingModel.findByIdAndDelete(bookingId);

      screen.availableSeats += booking.numberOfTickets;
      await theater.save();

      return booking;
    } catch (error) {
      throw error;
    }
  }


  async getBookingHistory(userId: string): Promise<IBooking[]> {
    try {
      const bookings: IBooking[] = await bookingModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie"
          }
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theater"
          }
        },
        {
          $project: {
            movie: 1,
            theater: 1,
            showTimings: 1,
            numberOfTickets: 1,
            price: 1,
            status: 1
          }
        }
      ])

      return bookings;
    } catch (error) {
      throw error;
    }
  }

  async sendBookingSummaryToUser(userId: string): Promise<void> {
    try {

      const user = await userRepositories.findOneBy('_id', userId);
      if (!user) {
        throw new Error("User not found.");
      }
      const bookings: any = await bookingModel.find({ user: userId })
        .populate("movieId")
        .populate("theaterId")
        .lean();

      if (bookings.length === 0) {
        throw new Error("No bookings found for this user.");
      }

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

      bookings.forEach((booking: any) => {
        tableContent += `
          <tr>
            <td>${booking.movieId.name}</td>
            <td>${booking.theaterId.name}</td>
            <td>${new Date(booking.showTimings).toLocaleString()}</td>
            <td>${booking.numberOfTickets}</td>
            <td>${booking.price}</td>
            <td>${booking.status}</td>
          </tr>`;
      });

      tableContent += `</tbody></table>`;

      const mailOptions = {
        from: "no-reply@yourapp.com",
        to: user.email,
        subject: "Your bookingModel Summary",
        html: `
          <h2>bookingModel Summary</h2>
          <p>Here is the summary of all your bookings:</p>
          ${tableContent}
          <p>Thank you for using our service!</p>
        `,
      };

      await sendVerificationEmail(mailOptions);

    } catch (error) {
      throw error;
    }
  }

}

export default new bookingRepository();