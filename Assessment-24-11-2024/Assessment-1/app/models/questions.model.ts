import { model, Schema } from 'mongoose';
import Joi, { ObjectSchema } from 'joi';
import { IQuestion } from '../interfaces/question.interface';

const questionValidator:ObjectSchema<IQuestion> = Joi.object({
    title: Joi.string().min(5).max(300).required(),
    categories: Joi.array().items(Joi.string()).required(),
    createdBy: Joi.string().required()
});

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const questionModel = model<IQuestion>('Question', questionSchema);

export { questionModel, questionValidator };
export default questionModel;