import batchRepository from "app/modules/batch.module/repositories/batch.repository";
import attendanceRepository from "../../repositories/attendance.repository";
import { IAttendance, ITokenUser } from "@interfaces";
import { Types } from "mongoose";

class attendanceController {
    async markAttendance(req: any, res: any): Promise<any> {
        try {
            const body = req.body;
            const batch = await batchRepository.getBatchById(body.batchId.toString());
            if (!batch) return res.status(404).json({ status: 404, message: 'Batch not found' });

            const teacher:ITokenUser = req.user;
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
}

export default new attendanceController();