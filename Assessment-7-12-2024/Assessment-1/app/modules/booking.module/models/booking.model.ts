import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IBooking } from "@interfaces";

const bookingValidator: ObjectSchema<IBooking> = joi.object({
  userId: joi.string().required(),
  movieId: joi.string().required(),
  theaterId: joi.string().required(),
  showTimings: joi.date().required(),
  numberOfTickets: joi.number().integer().min(1).required(),
  price: joi.number().required(),
  status: joi.string().required()
});

const bookingSchema: Schema<IBooking> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theatre",
    required: true,
  },
  showTimings: {
    type: Date,
    required: true,
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'used'],
    default: "booked",
  },
},
  { timestamps: true, versionKey: false });

const bookingModel: Model<IBooking> = model("Booking", bookingSchema);

export { bookingModel, bookingValidator };
export default bookingSchema;
