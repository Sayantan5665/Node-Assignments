
import { categoryModel } from '../models/categories.model';
import { ICategory } from '../../../interfaces/category.interface';
import commonRepo from '../../../repositories/common.repository';

class categoryRepo extends commonRepo {
    // model = categoryModel;
    constructor() {
        super(categoryModel);
        this.fetchAllCategoryWithQuestionsCount = this.fetchAllCategoryWithQuestionsCount.bind(this); //this is needed when createCategory is not arraow function
    }

    async save(data: ICategory) {
        try {
            const newCategory: ICategory | null = await this._save(data);
            return newCategory;
        } catch (error: any) {
            throw error;
        }
    }

    async findOneBy(param: any): Promise<ICategory> {
        try {
            const category: ICategory = await this._findOne(param);
            return category;
        } catch (error: any) {
            throw error;
        }
    }


    async fetchAllCategoryWithQuestionsCount(): Promise<Array<ICategory>> {
        try {
            let x: number[] = [1, 2, 3, 4];
            const categories = await categoryModel.aggregate([
                {
                    $lookup: {
                        from: "questions",
                        localField: "_id",
                        foreignField: "categories",
                        as: "questions"
                    }
                },
                {
                    $project: {
                        name: '$name',
                        description: '$description',
                        questionsCount: { $size: '$questions' },
                    }
                }
            ]);

            return categories;
        } catch (error: any) {
            throw error;
        }
    }
}

export default new categoryRepo();