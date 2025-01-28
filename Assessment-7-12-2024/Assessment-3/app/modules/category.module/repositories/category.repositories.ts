import { ICategory } from "@interfaces";
import { categoryModel, categoryValidator } from "../models/category.model";

class categoryRepo {
    async addCategory(body: ICategory): Promise<ICategory> {
        try {
            const { error } = categoryValidator.validate(body);
            if (error) throw error;

            const data = new categoryModel(body);
            const newCategory: ICategory = await data.save();
            return newCategory;
        } catch (error) {
            throw error;
        }
    }

    async fetchCategories(): Promise<Array<ICategory>> {
        try {
            const categories: Array<ICategory> = await categoryModel.find({isActive: true});
            return categories;
        } catch (error) {
            throw error;
        }
    }

    async fetchCategoryById(categoryId: string): Promise<ICategory | null> {
        try {
            const category: ICategory | null = await categoryModel.findOne({ _id: categoryId, isActive: true });
            return category;
        } catch (error) {
            throw error;
        }
    }
    async fetchCategoryByTitle(title: string): Promise<ICategory | null> {
        try {
            const category: ICategory | null = await categoryModel.findOne({title, isActive: true});
            return category;
        } catch (error) {
            throw error;
        }
    }
    async updateCategory(categoryId: string, body: ICategory): Promise<ICategory | null> {
        try {
            const category: ICategory | null = await categoryModel.findByIdAndUpdate(categoryId, body, { new: true });
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(categoryId: string): Promise<ICategory | null> {
        try {
            const category: ICategory | null = await categoryModel.findByIdAndUpdate(categoryId, { isActive: false }, { new: true });
            return category;
        } catch (error) {
            throw error;
        }
    }
}

export default new categoryRepo();