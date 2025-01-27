import { Router } from 'express';
import attendanceController from 'app/modules/attendance.module/controllers/api/attendance.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/attendance/mark:
 *   post:
 *     summary: Mark and update attendance (Assign teacher only)
 *     tags:
 *       - Attendance
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Mark attendance
 *         description: Mark attendance.
 *         schema:
 *           type: object
 *           required:
 *             - batchId
 *             - records
 *           properties:
 *             batchId:
 *               type: string
 *             date:
 *               type: string
 *               format: date
 *             records:
 *               type: array
 *               items: 
 *                 type: object
 *                 required:
 *                   - student
 *                   - status
 *                 properties:
 *                   student:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum:
 *                       - present
 *                       - absent
 *     responses:
 *        200:
 *          description: Attendance marked successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/mark', auth, authorize('teacher'), attendanceController.markAttendance);

/**
 * @swagger
 * /api/attendance/fetch/of-batch/{batchId}:
 *   get:
 *     summary: Fetch attendance of a batch
 *     tags: 
 *       - Attendance
 *     security: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: batchId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Attendance of the batch fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance of the batch fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/of-batch/:batchId', attendanceController.fetchAttendanceOfRecordsByBatch);


/**
 * @swagger
 * /api/attendance/fetch:
 *   get:
 *     summary: Fetch attendance records of a student in a batch
 *     tags: 
 *       - Attendance
 *     security: []
 *     produces: application/json
 *     parameters:
 *       - in: query
 *         name: batchId
 *         type: string
 *         required: true
 *       - in: query
 *         name: studentId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Attendance of the student fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance of the student fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch', attendanceController.getAttendanceRecordsByStudent);

/**
 * @swagger
 * /api/attendance/fetch/all:
 *   get:
 *     summary: Fetch all attendance records
 *     tags: 
 *       - Attendance
 *     security: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: Attendance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all', attendanceController.geAllAttendanceRecords);


export default route;