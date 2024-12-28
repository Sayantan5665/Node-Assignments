import { model, Schema } from 'mongoose';
import Joi, { ObjectSchema } from 'joi';
import { IAnswer } from '../interfaces/answer.interface';

const answerValidator: ObjectSchema<IAnswer> = Joi.object({
    question: Joi.string().required(),
    user: Joi.string().required(),
    content: Joi.string().required(),
    submittedAt: Joi.date(),
    userTimezone: Joi.string().required(),
});

const answerSchema = new Schema<IAnswer>({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  userTimezone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const answerModel =  model<IAnswer>('Answer', answerSchema);

export { answerModel, answerValidator };
export default answerModel;