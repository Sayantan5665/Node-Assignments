import { Router } from 'express';
import examController from 'app/modules/exam.module/controllers/api/exam.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/exam/create:
 *   post:
 *     summary: Create Examinations (Admin/Teacher)
 *     tags:
 *       - Examinations
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Create Examinations
 *         description: Create Examinations.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - batchId
 *             - duration
 *             - totalMarks
 *             - passingMarks
 *           properties:
 *             name:
 *               type: string
 *             batchId:
 *               type: string
 *             date:
 *               type: string
 *               format: date
 *             duration:
 *               type: number
 *             totalMarks:
 *               type: number
 *             passingMarks:
 *               type: number
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - studentId
 *                   - marks
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   marks:
 *                     type: number
 *     responses:
 *        200:
 *          description: Batches created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, authorize('admin', 'teacher'), examController.createExam);

/**
 * @swagger
 * /api/exam/assign/{examId}:
 *   post:
 *     summary: Create Examinations (Admin/Teacher)
 *     tags:
 *       - Examinations
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: examId
 *         type: string
 *         required: true
 *       - in: body
 *         name: Create Examinations
 *         description: Create Examinations.
 *         schema:
 *           type: object
 *           required:
 *             - results
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - studentId
 *                   - marks
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   marks:
 *                     type: number
 *     responses:
 *        200:
 *          description: Batches created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/assign/:examId', auth, authorize('admin', 'teacher'), examController.createExam);

/**
 * @swagger
 * /api/exam/update/{examId}:
 *   put:
 *     summary: Update Examinations (Admin/Teacher)
 *     tags:
 *       - Examinations
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: examId
 *         type: string
 *         required: true
 *       - in: body
 *         name: Create Examinations
 *         description: Create Examinations.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - batchId
 *             - duration
 *             - totalMarks
 *             - passingMarks
 *           properties:
 *             name:
 *               type: string
 *             batchId:
 *               type: string
 *             date:
 *               type: string
 *               format: date
 *             duration:
 *               type: number
 *             totalMarks:
 *               type: number
 *             passingMarks:
 *               type: number
 *             results:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - studentId
 *                   - marks
 *                 properties:
 *                   studentId:
 *                     type: string
 *                     required: true
 *                   marks:
 *                     type: number
 *                     required: true
 *     responses:
 *        200:
 *          description: Examination's information updated successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.put('/update/:examId', auth, authorize('admin', 'teacher'), examController.updateExam);

/**
 * @swagger
 * /api/exam/fetch-by-batch/{batchId}:
 *   get:
 *     summary: Fetch exam record by batch (Admin/Teacher)
 *     tags: 
 *       - Examinations
 *     security: 
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: batchId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Successfully fetch exam record 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetch exam record
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch-by-batch/:batchId', auth, authorize('admin', 'teacher'), examController.getExamsByBatch);

/**
 * @swagger
 * /api/exam/fetch-by-exam-id/{examId}/of-batch/{batchId}:
 *   get:
 *     summary: Fetch exam record by exam
 *     tags: 
 *       - Examinations
 *     security: 
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: batchId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Successfully fetch exam record 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetch exam record
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch-by-exam-id/:examId/of-batch/:batchId', auth, examController.getExamsByExamId);


export default route;