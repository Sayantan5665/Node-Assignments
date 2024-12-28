import { Request, Response } from 'express';
import { categoryModel } from '../models/categories.model';
import questionRepo from '../repositories/question.repository';
import { IQuestion } from '../interfaces/question.interface';
import { Types } from 'mongoose';

class questionController {

    async createQuestion(req: Request, res: Response): Promise<any> {
        try {
            const body:IQuestion = req.body;
            req.user && (body.createdBy = (req.user.id as any));

            const question = await questionRepo.save(body);

            res.status(200).json({ 
                status: 200,
                message: 'Question created successfully', 
                data: question 
            });
        } catch (error:any) {
            res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong! Please try again.',
                error: error,
            });
        }
    }

    

    async getQuestionByCategoryId (req: Request, res: Response): Promise<any> {
        try {
            const categoryId: string = req.params.id;
            console.log("categoryId =>: ", categoryId);
            const questions = await questionRepo.findQuestionsByCategory(new Types.ObjectId(categoryId));

            res.status(200).json({
                status: 200,
                message: 'Questions fetched successfully!',
                data: questions,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error!',
                error
            });
        }
    }

    async getAllQuestionCategoryWise (req: Request, res: Response): Promise<any> {
        try {
            const questions = await questionRepo.fetchAllQuestionCategoriesWise();

            res.status(200).json({
                status: 200,
                message: 'Questions fetched successfully!',
                data: questions,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error!',
                error
            });
        }
    }

    async getQuestionwithAnswers(req: Request, res: Response): Promise<any>{
        try {
            const question = await questionRepo.fetchQuestionwithAnswers(req, req.params.questionId);
            res.status(200).json({
                status: 200,
                message: 'Question fetched successfully!',
                data: question,
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error!',
                error
            });
        }
    }
}

export default new questionController();