import { Router } from 'express';
import enrollmentController from 'app/modules/enrollment.module/controllers/api/enrollment.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/enrollment/student-enroll:
 *   post:
 *     summary: Enroll student (Admin only)
 *     tags:
 *       - Enrollments
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Enroll student
 *         description: Enrolled student successfully.
 *         schema:
 *           type: object
 *           required:
 *             - studentId
 *             - courseId
 *             - batchId
 *           properties:
 *             studentId:
 *               type: string
 *             courseId:
 *               type: string
 *             batchId:
 *               type: string
 *             enrollmentDate:
 *               type: string
 *               format: date
 *             status:
 *               type: string
 *               enum:
 *                 - active
 *                 - completed
 *                 - dropped
 *     responses:
 *        200:
 *          description: Enrolled student successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/student-enroll', auth, authorize('admin'), enrollmentController.enrollStudent);

export default route;