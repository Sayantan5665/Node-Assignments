import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ICategory } from "@interfaces";


const categoryValidator: ObjectSchema<ICategory> = joi.object({
    title: joi.string().required(),
    description: joi.string().required()
});

const categorySchema: Schema<ICategory> = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    isActive: {type: Boolean, default: true}
}, { timestamps: true, versionKey: false });

const categoryModel: Model<ICategory> = model('Category', categorySchema);

export { categoryModel, categoryValidator };
export default categoryModel;