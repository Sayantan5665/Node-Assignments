import { Request, Response } from "express";
import enrollmentRepository from "../../repositories/enrollment.repository";

class enrollmentController {
    /**
     ** Admin Only
     */
    async enrollStudent(req: Request, res: Response):Promise<any> {
        try {
            const data = await enrollmentRepository.enrollStudent(req.body);
            return res.status(200).json({
                status: 200,
                message: 'Student enrolled successfully',
                data
            });
        } catch (error:any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'An error occurred while enrolling student',
                error
            });
        }
    }
}

export default new enrollmentController();