import { examModel, examValidator } from '../models/exam.model';
import { IBatch, IExam, ITokenUser } from '@interfaces';
import batchModel from 'app/modules/batch.module/models/batch.model';
import { Request } from 'express';
import { Types } from 'mongoose';


class examRepository {
    async createExam(loggedUser: ITokenUser, body: IExam): Promise<IExam> {
        try {
            const batch: IBatch | null = await batchModel.findById(body.batchId.toString());
            if (!batch) throw new Error('Batch not found');

            if (loggedUser.role.role == 'admin' || (loggedUser.role.role == 'teacher' && (batch.teacherId.toString() !== loggedUser.id))) {
                throw new Error('Only admin or assigned teacher can assign the marks.');
            }

            const { error } = examValidator.validate(body);
            if (error) throw error;

            const exam = await examModel.create(body);
            return exam;
        } catch (err) {
            throw err;
        }
    }

    
    async assignMarks(loggedUser: ITokenUser, examId: string, results: Array<{ studentId: Types.ObjectId, marks: number }>): Promise<IExam> {
        try {

            const exam: IExam | null = await examModel.findById(examId);
            if (!exam) {
                throw new Error('Exam not found');
            }

            // Validate students and marks
            const batch: IBatch | null = await batchModel.findById(exam.batchId.toString());
            if (!batch) {
                throw new Error('Batch not found');
            }

            if (loggedUser.role.role == 'admin' || (loggedUser.role.role == 'teacher' && (batch.teacherId.toString() !== loggedUser.id))) {
                throw new Error('Only admin or assigned teacher can assign the marks.');
            }

            const validStudentIds = batch.students.map((id: Types.ObjectId | string) => id.toString());

            const invalidResults = results.filter(result =>
                !validStudentIds.includes(result.studentId.toString()) ||
                result.marks > exam.totalMarks
            );

            if (invalidResults.length > 0) {
                throw new Error('Invalid student IDs or marks exceeding total marks');
            }

            exam.results = results;
            const updateResult = await exam.save();
            return updateResult;
        } catch (error) {
            throw error;
        }
    }


    async getExamsByBatch(loggedUser: ITokenUser, batchId: string): Promise<IExam[]> {
        try {
            const batch: IBatch | null = await batchModel.findById(batchId);
            if (!batch) { throw new Error('Batch not found'); }

            if (loggedUser.role.role == 'student') {
                throw new Error('You do not have access to this resource');
            }

            const exams = await examModel.aggregate([
                {
                    $match: {
                        batchId: new Types.ObjectId(batchId)
                    }
                },
                {
                    $unwind: "$results"
                },
                {
                    $match: {
                        "results.student": new Types.ObjectId(loggedUser.id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'results.student',
                        foreignField: '_id',
                        as: 'studentInfo'
                    }
                },
                {
                    $unwind: "$studentInfo"
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        date: 1,
                        duration: 1,
                        passingMarks: 1,
                        totalMarks: 1,
                        results: {
                            studentDetails: {
                                _id: "$studentInfo._id",
                                name: "$studentInfo.name",
                                email: "$studentInfo.email",
                            },
                            marks: "$results.marks"
                        }
                    }
                }
            ]);
            return exams;
        } catch (err) {
            throw err;
        }
    }

    
    async getExamsByStudent(loggedUser: ITokenUser, examId: string, batchId: string): Promise<IExam[]> {
        try {
            const batch: IBatch | null = await batchModel.findById(batchId);
            if (!batch) { throw new Error('Batch not found'); }

            // If student is requesting, verify they belong to the batch
            if (loggedUser.role.role !== 'student') {
                throw new Error('You do not have access to this resource');
            } else {
                if (!batch.students.includes(new Types.ObjectId(loggedUser.id))) {
                    throw new Error('You do not have access to this batch');
                }
            }

            const exams: Array<IExam> = await examModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(examId),
                        batchId: new Types.ObjectId(batchId)
                    }
                },
                {
                    $unwind: "$results"
                },
                {
                    $match: {
                        "results.studentId": new Types.ObjectId(loggedUser.id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'results.studentId',
                        foreignField: '_id',
                        as: 'studentInfo'
                    }
                },
                {
                    $unwind: "$studentInfo"
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        date: 1,
                        duration: 1,
                        passingMarks: 1,
                        totalMarks: 1,
                        results: {
                            studentDetails: {
                                _id: "$studentInfo._id",
                                name: "$studentInfo.name",
                                email: "$studentInfo.email",
                            },
                            marks: "$results.marks"
                        }
                    }
                }
            ])
            return exams;
        } catch (err) {
            throw err;
        }
    }

    async updateExam(loggedUser: ITokenUser, examId: string, body: IExam): Promise<IExam> {
        try {
            const exam: IExam | null = await examModel.findById(examId);
            if (!exam) {
                throw new Error('Exam not found');
            }

            const batch: IBatch | null = await batchModel.findById(exam.batchId.toString());
            if (!batch) {
                throw new Error('Batch not found');
            }

            if (loggedUser.role.role == 'admin' || (loggedUser.role.role == 'teacher' && (batch.teacherId.toString() !== loggedUser.id))) {
                throw new Error('Only admin or assigned teacher can assign the marks.');
            }

            const validStudentIds = batch.students.map((id: Types.ObjectId | string) => id.toString());

            const invalidResults = body.results.filter(result =>
                !validStudentIds.includes(result.studentId.toString()) ||
                result.marks > exam.totalMarks
            );

            if (invalidResults.length > 0) {
                throw new Error('Invalid student IDs or marks exceeding total marks');
            }

            const updateResult = await examModel.findByIdAndUpdate(examId, body, {new: true});
            if(!updateResult) {
                throw new Error('Exam not found');
            }
            return updateResult;
        } catch (error) {
            throw error;
        }
    }
}

export default new examRepository();