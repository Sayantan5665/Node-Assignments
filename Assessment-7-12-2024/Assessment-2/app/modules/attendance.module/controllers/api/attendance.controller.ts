import batchRepository from "app/modules/batch.module/repositories/batch.repository";
import attendanceRepository from "../../repositories/attendance.repository";
import { IAttendance, ITokenUser } from "@interfaces";
import { Request, Response } from "express";

class attendanceController {
    /*** Teacher Only */
    async markAttendance(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;
            const batch = await batchRepository.getBatchById(body.batchId.toString());
            if (!batch) return res.status(404).json({ status: 404, message: 'Batch not found' });

            const teacher:ITokenUser|undefined = req.user;
            if (!teacher) {
                return res.status(403).json({ status: 403, message: 'Unauthorized ro not loggedin' });
            }
            if (batch.teacher._id.toString()!== teacher.id.toString()) {
                return res.status(403).json({ status: 403, message: 'Only the assigned teacher can mark attendance' });
            } else {
                body.markedBy = teacher.id;
            }

            if(!body.date) {
                body.date = new Date();
                if(body.date == "Invalid Date") {
                    return res.status(400).json({ status: 400, message: 'Invalid date.' });
                }
            }

            body.uniqueId && delete body.uniqueId;

            const markedAttendance: IAttendance = await attendanceRepository.addUpdateAttendance(body);
            return res.status(200).json({
                status: 200,
                message: 'Attendance marked successfully',
                data: markedAttendance
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
     * Fetch attendance records by: (Admin/Teacher)
     ** Student (for a specific course or batch).
     */
    async getAttendanceRecordsByStudent(req:Request, res:Response): Promise<any> {
        try {
            const studentId = req.query.studentId as string;
            const batchId = req.query.batchId as string;
            if (!studentId || !batchId) {
                return res.status(400).json({
                    status: 400,
                    message: 'Student id and batch id are required'
                });
            }
            const attendance = await attendanceRepository.getAttendanceRecordsByStudent(studentId, batchId);
            return res.status(200).json({
                status: 200,
                message: 'Attendance fetched successfully',
                data: attendance
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
    * Fetch attendance records by: (Admin/Teacher)
    ** Batch (view attendance percentage for all students).
    */
    async fetchAttendanceOfRecordsByBatch(req: Request, res: Response): Promise<any> {
        try {
            const batchId = req.params.batchId;
            const attendance = await attendanceRepository.getAttendanceOfRecordsByBatch(batchId);
            return res.status(200).json({
                status: 200,
                message: 'Attendance fetched successfully',
                data: attendance
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    /*** Get all Records (Admin/Teachers) */
    async geAllAttendanceRecords(req: Request, res: Response): Promise<any> {
        try {
            const attendance = await attendanceRepository.geAllAttendanceRecords();
            return res.status(200).json({
                status: 200,
                message: 'Attendance fetched successfully',
                data: attendance
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

export default new attendanceController();