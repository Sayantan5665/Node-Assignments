import { questionModel, questionValidator } from '../models/questions.model';
import { IQuestion } from '../interfaces/question.interface';
import commonRepo from './common.repository';
import { Types } from 'mongoose';
import { Request } from 'express';


class questionRepo extends commonRepo {
    constructor() {
        super(questionModel)
    }

    async save(data: IQuestion): Promise<IQuestion | null> {
        try {
            const { error } = questionValidator.validate(data);
            if (error) {
                throw error;
            }

            const question: IQuestion = await this._save(data);
            return question;
        } catch (error) {
            throw error;
        }
    }

    async findQuestionsByCategory(categoryId: Types.ObjectId): Promise<any> {
        try {
            console.log("categoryId: ", categoryId);
            const questions = questionModel.aggregate([
                {
                    $match: {
                        categories: categoryId
                    }
                },
                // {
                //     $lookup: {
                //         from: "categories",
                //         localField: "categories",
                //         foreignField: "_id",
                //         as: "categoryDetails"
                //     }
                // },
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "createdBy"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        categories: 1,
                        createdAt: 1,
                        createdBy: {
                            _id: 1,
                            name: 1,
                            email: 1
                        }
                    }
                }
            ]);
            return questions;
        } catch (error) {
            throw error;
        }
    }

    async fetchAllQuestionCategoriesWise(): Promise<any> {
        try {
            const questions = questionModel.aggregate([
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $unwind: {
                        path: '$categories',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$categories",
                        questions: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category',
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        "category.question": "$questions",
                    }
                },
                {
                    $project: {
                        "category": "$category.category",
                        "name": "$category.name",
                        "description": "$category.description",
                        "question": "$category.question",
                    }
                }
            ]);
            return questions;
        } catch (error) {
            throw error;
        }
    }
    async fetchQuestionwithAnswers(req: Request, questionId: string): Promise<any> {
        try {
            const _questionId = new Types.ObjectId(questionId);
            const questions = questionModel.aggregate([
                {
                    $match: {
                        _id: _questionId
                    }
                },
                {
                    $lookup: {
                        from: 'answers',
                        localField: '_id',
                        foreignField: 'question',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user',
                                    foreignField: '_id',
                                    as: 'user',
                                }
                            },
                            {
                                $unwind: {
                                    path: '$user',
                                    preserveNullAndEmptyArrays: true,
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    content: 1,
                                    submittedAt: 1,
                                    'user._id': 1,
                                    'user.name': 1,
                                    'user.email': 1,
                                    'user.image': 1,
                                    'user.timeZone': 1,
                                    userTimezone: 1
                                }
                            }
                        ],
                        as: 'answers'
                    }
                },
                // Adjust the submittedAt field to the user's timezone
                {
                    $addFields: {
                        'answers.submittedAt': {
                            $map: {
                                input: '$answers',
                                as: 'answer',
                                in: {
                                    $dateToString: {
                                        format: '%Y-%m-%d %H:%M:%S',
                                        date: '$$answer.submittedAt',
                                        timezone: req.user?.timeZone || '$$answer.userTimezone',
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        answers: {
                            _id: 1,
                            user: 1,
                            content: 1,
                            submittedAt: 1
                        },
                    },
                },
            ]);
            return questions;
        } catch (error) {
            throw error;
        }
    }
}

export default new questionRepo();