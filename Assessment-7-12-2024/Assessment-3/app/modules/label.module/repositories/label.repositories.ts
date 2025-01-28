import { ILabel } from "@interfaces";
import { labelModel, labelValidator } from "../models/label.model";

class labelRepo {
    async addLabel(body: ILabel): Promise<ILabel> {
        try {
            const { error } = labelValidator.validate(body);
            if (error) throw error;

            const data = new labelModel(body);
            const newLabel: ILabel = await data.save();
            return newLabel;
        } catch (error) {
            throw error;
        }
    }

    async fetchLabels(): Promise<Array<ILabel>> {
        try {
            const labels: Array<ILabel> = await labelModel.find({isActive: true});
            return labels;
        } catch (error) {
            throw error;
        }
    }

    async fetchLabelById(labelId: string): Promise<ILabel | null> {
        try {
            const label: ILabel | null = await labelModel.findOne({ _id: labelId, isActive: true });
            return label;
        } catch (error) {
            throw error;
        }
    }
    async fetchLabelByTitle(title: string): Promise<ILabel | null> {
        try {
            const label: ILabel | null = await labelModel.findOne({title, isActive: true});
            return label;
        } catch (error) {
            throw error;
        }
    }
    async updateLabel(labelId: string, body: ILabel): Promise<ILabel | null> {
        try {
            const label: ILabel | null = await labelModel.findByIdAndUpdate(labelId, body, { new: true });
            if (!label) {
                throw new Error('Label not found');
            }
            return label;
        } catch (error) {
            throw error;
        }
    }

    async deleteLabel(labelId: string): Promise<ILabel | null> {
        try {
            const label: ILabel | null = await labelModel.findByIdAndUpdate(labelId, { isActive: false }, { new: true });
            return label;
        } catch (error) {
            throw error;
        }
    }
}

export default new labelRepo();