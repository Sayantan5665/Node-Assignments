import { Schema, model } from 'mongoose';
import { ICategory } from '../../../interfaces/category.interface';


const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true }
}, { timestamps: true });

export const categoryModel = model<ICategory>('Category', categorySchema);