import { Router } from 'express';
import batchController from 'app/modules/batch.module/controllers/api/batch.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/batch/create:
 *   post:
 *     summary: Create Batches (Admin only)
 *     tags:
 *       - Batches
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Create Batches
 *         description: Create Batches.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - courseId
 *             - teacherId
 *             - startDate
 *             - endDate
 *           properties:
 *             name:
 *               type: string
 *             courseId:
 *               type: string
 *             teacherId:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *     responses:
 *        200:
 *          description: Batches created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, authorize('admin'), batchController.createBatch);

/**
 * @swagger
 * /api/batch/assign-students:
 *   post:
 *     summary: Assign student to batches (Admin only)
 *     tags:
 *       - Batches
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Assign student to batches
 *         description: Assign student to batches.
 *         schema:
 *           type: object
 *           required:
 *             - studentId
 *             - batchId
 *           properties:
 *             studentId:
 *               type: string
 *             batchId:
 *               type: string
 *     responses:
 *        200:
 *          description: Successfully assigned student to batch
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/assign-students', auth, authorize('admin'), batchController.assignStudentToBatch);

/**
 * @swagger
 * /api/batch/remove-students:
 *   post:
 *     summary: Remove student from batches (Admin only)
 *     tags:
 *       - Batches
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Remove student to batches
 *         description: Remove student from batches.
 *         schema:
 *           type: object
 *           required:
 *             - studentId
 *             - batchId
 *           properties:
 *             studentId:
 *               type: string
 *             batchId:
 *               type: string
 *     responses:
 *        200:
 *          description: Successfully removed student from batch
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/remove-students', auth, authorize('admin'), batchController.removeStudentFromBatch);

/**
 * @swagger
 * /api/batch/update/{id}:
 *   put:
 *     summary: Update Batches (Admin only)
 *     tags:
 *       - Batches
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: Update Batches
 *         description: Update Batches.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             courseId:
 *               type: string
 *             teacherId:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *     responses:
 *        200:
 *          description: Batche information updated successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.put('/update/:id', auth, authorize('admin'), batchController.updateBatch);

/**
 * @swagger
 * /api/batch/fetch/all/{courseId}:
 *   get:
 *     summary: Fetch all the batches
 *     tags: 
 *       - Batches
 *     security: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: courseId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: All batches fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All batches fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all/:courseId', batchController.getAllBatches);

/**
 * @swagger
 * /api/batch/delete/{id}:
 *   delete:
 *     summary: Delete Batch (Admin only)
 *     tags: 
 *       - Batches
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Batch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Batch deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.delete('/delete/:id', auth, authorize('admin'), batchController.deleteBatch);

export default route;