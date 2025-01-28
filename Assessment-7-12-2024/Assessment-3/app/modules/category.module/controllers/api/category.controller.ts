import { Request, Response } from "express";
import categoryRepo from "../../repositories/category.repositories";
import { ICategory } from "@interfaces";

class categoryController {
    /*** (Admin only) */
    async createCategory(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;

            const existingCategory: ICategory | null = await categoryRepo.fetchCategoryByTitle(body.title);
            if (existingCategory) {
                return res.status(400).json({
                    status: 400,
                    message: 'This category already exists!',
                });
            }

            const newCategory: ICategory = await categoryRepo.addCategory(body);
            res.status(200).json({
                status: 200,
                message: 'Category created successfully!',
                data: newCategory,
            });
        } catch (error: any) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            });
        }
    }

    /*** (Everyone) */
    async getCategory(req: Request, res: Response): Promise<any> {
        try {
            const category: Array<ICategory> = await categoryRepo.fetchCategories();

            res.status(200).json({
                status: 200,
                message: 'Category fetched successfully!',
                data: category,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (Admin only) */
    async updateCategory(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;
            const categoryId = req.params.id;

            const _category: ICategory | null = await categoryRepo.fetchCategoryById(categoryId);
            if (!_category) {
                return res.status(404).json({
                    status: 404,
                    message: 'Category not found!',
                });
            }
            body.isActive = _category.isActive;

            const updatedCategory: ICategory | null = await categoryRepo.updateCategory(categoryId, body);

            if (!updatedCategory) {
                return res.status(404).json({
                    status: 404,
                    message: 'Category not found!',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Category updated successfully!',
                data: updatedCategory,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (Admin only) */
    async deleteCategory(req: Request, res: Response): Promise<any> {
        try {
            const categoryId = req.params.id;

            const existingCategory = await categoryRepo.fetchCategoryById(categoryId);
            if (!existingCategory) {
                return res.status(404).json({
                    status: 404,
                    message: 'Category not found!',
                });
            }

            const category = await categoryRepo.deleteCategory(categoryId);
            if (!category) {
                return res.status(400).json({
                    status: 400,
                    message: 'Some error occured',
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Category deleted successfully!'
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

}

export default new categoryController();