import { Request, Response } from "express";
import batchRepository from "../../repositories/batch.repository";
import { IBatch } from "@interfaces";

class batchController {
    /**
     ** Admin Only
     */
    async createBatch(req: Request, res: Response): Promise<any> {
        try {
            const newBatch: IBatch = await batchRepository.addBatch(req.body);
            return res.status(200).json({
                status: 200,
                message: 'Batch added successfully',
                data: newBatch
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /**
     ** Admin Only
     */
    async assignStudentToBatch(req: Request, res: Response): Promise<any> {
        try {
            const { studentId, batchId } = req.body;
            if (!studentId || !batchId) {
                return res.status(400).json({
                    status: 400,
                    message: 'StudentId and BatchId are required'
                });
            }
            const updatedBatch: IBatch = await batchRepository.assignStudentToBatch(studentId, batchId);
            return res.status(200).json({
                status: 200,
                message: 'Student assigned to batch successfully',
                data: updatedBatch
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /**
     ** Admin Only
     */
    async removeStudentFromBatch(req: Request, res: Response): Promise<any> {
        try {
            const { studentId, batchId } = req.body;
            if (!studentId || !batchId) {
                return res.status(400).json({
                    status: 400,
                    message: 'StudentId and BatchId are required'
                });
            }
            const updatedBatch: IBatch = await batchRepository.removeStudentFromBatch(studentId, batchId);
            return res.status(200).json({
                status: 200,
                message: 'Student removed from batch successfully',
                data: updatedBatch
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /**
     ** Admin Only
     */
    async updateBatch(req: Request, res: Response): Promise<any> {
        try {
            const batchId: string = req.params.id;
            const updatedBatch: IBatch | null = await batchRepository.updateBatch(batchId, req.body);
            if (!updatedBatch) {
                return res.status(200).json({
                    status: 400,
                    message: 'Batch not found'
                });
            }
            return res.status(200).json({
                status: 200,
                message: 'Batch updated successfully',
                data: updatedBatch
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /**
     ** Admin Only
     */
    async deleteBatch(req: Request, res: Response): Promise<any> {
        try {
            const batchId: string = req.params.id;
            await batchRepository.deleteBatch(batchId);
            return res.status(200).json({
                status: 200,
                message: 'Batch removed successfully'
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /**
     * Fetch all batches for a course, including:
     ** Batch name
     ** Total students
     ** Assigned teacher
     */
    async getAllBatches(req: Request, res: Response): Promise<any> {
        try {
            const batches: IBatch[] = await batchRepository.getAllBatches(req.body.courseId);
            return res.status(200).json({
                status: 200,
                message: 'Fetched all batches',
                data: batches
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }
}

export default new batchController();