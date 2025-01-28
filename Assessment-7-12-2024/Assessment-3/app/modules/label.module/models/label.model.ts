import { Model, Schema, model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ILabel } from "@interfaces";


const labelValidator: ObjectSchema<ILabel> = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    color: joi.string()
});

const labelSchema: Schema<ILabel> = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    color: {type: String, default: "#f9f9f9"},
    isActive: {type: Boolean, default: true}
}, { timestamps: true, versionKey: false });

const labelModel: Model<ILabel> = model('Label', labelSchema);

export { labelModel, labelValidator };
export default labelModel;