import { Model } from "mongoose";
abstract class commonRepo {
    // abstract model: Model<any>;

    model!: Model<any>;
    constructor(model: Model<any>) {
        this.model = model;
    }

    async _findOne(param:any): Promise<any> {
        try {
            const doc: Array<any> = await this.model.aggregate([{ $match: param }]);
            return doc.length > 0 ? doc[0] : null;
        } catch (error: any) {
            throw error;
        }
    }

    async _findById(id:string): Promise<any> {
        try {
            const doc = await this.model.findById(id);
            return doc ? doc : null;
        } catch (error: any) {
            throw error;
        }
    }

    async _save(data:any): Promise<any> {
        try {
            const newDoc = new this.model(data);
            await newDoc.save();
            return newDoc;
        } catch (error: any) {
            throw error;
        }
    }
}

export default commonRepo;