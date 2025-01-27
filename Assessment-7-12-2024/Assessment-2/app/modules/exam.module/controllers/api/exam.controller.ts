import { Request, Response } from "express";
import examRepository from "../../repositories/exam.repository";
import { IExam } from "@interfaces";

class examController {
    /*** Create new exam (Admin/Teacher) */
    async createExam(req: Request, res: Response): Promise<any> {
        try {
            const loggedUser = req.user;
            if (!loggedUser) {
                return res.status(401).json({
                    status: 401,
                    message: 'Please login first!'
                });
            }

            const exam: IExam = await examRepository.createExam(loggedUser, req.body);
            return res.status(200).json({
                status: 200,
                message: 'Exam created successfully',
                data: exam
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "error creating exam",
                error
            });
        }
    }

    /*** Assign marks of all student at once (Admin/Teacher Only) */
    async assignMarks(req: Request, res: Response): Promise<any> {
        try {
            const examId = req.params.examId;
            const loggedUser = req.user;
            if (!loggedUser) {
                return res.status(401).json({
                    status: 401,
                    message: 'Please login first!'
                });
            }

            const exam: IExam = await examRepository.assignMarks(loggedUser, examId, req.body.results);

            return res.status(200).json({
                status: 200,
                message: 'Marks assigned successfully',
                data: exam
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "error assigning marks",
                error
            });
        }
    }

    /*** Fetch by batch (Admin/Teacher) */
    async getExamsByBatch(req: Request, res: Response): Promise<any> {
        try {
            const batchId = req.params.batchId;
            const loggedUser = req.user;
            if (!loggedUser) {
                return res.status(401).json({
                    status: 401,
                    message: 'Please login first!'
                });
            }

            const exams: IExam[] = await examRepository.getExamsByBatch(loggedUser, batchId);

            return res.status(200).json({
                status: 200,
                message: 'Exams fetched successfully',
                data: exams
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "error fetching exams",
                error
            });
        }
    }

    /*** Fetch by examId for individual student */
    async getExamsByExamId(req: Request, res: Response): Promise<any> {
        try {
            const batchId = req.params.batchId;
            const examId = req.params.examId;
            const loggedUser = req.user;
            if (!loggedUser) {
                return res.status(401).json({
                    status: 401,
                    message: 'Please login first!'
                });
            }

            const exams: IExam[] = await examRepository.getExamsByStudent(loggedUser, examId, batchId);

            return res.status(200).json({
                status: 200,
                message: 'Exams fetched successfully',
                data: exams
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "error fetching exams",
                error
            });
        }
    }

    /*** Update exam info and marks (Admin/Teacher) */
    async updateExam(req: Request, res: Response): Promise<any> {
        try {
            const examId = req.params.examId;
            const loggedUser = req.user;
            if (!loggedUser) {
                return res.status(401).json({
                    status: 401,
                    message: 'Please login first!'
                });
            }

            const body = req.body;

            const exam: IExam = await examRepository.updateExam(loggedUser, examId, body);

            return res.status(200).json({
                status: 200,
                message: 'Exam updated successfully',
                data: exam
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "error updating exam",
                error
            });
        }
    }
}

export default new examController();