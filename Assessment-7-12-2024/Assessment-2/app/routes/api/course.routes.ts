import { Router } from 'express';
import courseController from 'app/modules/course.module/controllers/api/course.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/course/create:
 *   post:
 *     summary: Create Courses (Admin only)
 *     tags:
 *       - Courses
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Create Courses
 *         description: Create Courses.
 *         schema:
 *           type: object
 *           required:
 *             - name,
 *             - description,
 *             - duration,
 *             - fees
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             duration:
 *               type: number
 *             fees:
 *               type: number
 *     responses:
 *        200:
 *          description: Courses created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, authorize('admin'), courseController.createCourse);

/**
 * @swagger
 * /api/course/fetch/all:
 *   get:
 *     summary: Fetch all the courses
 *     tags: 
 *       - Courses
 *     security: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All courses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All courses fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all', courseController.fetchAllCourses);

/**
 * @swagger
 * /api/course/update/{id}:
 *   put:
 *     summary: Update courses information (Admin only)
 *     tags: 
 *       - Courses
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: body
 *         name: Create Courses
 *         description: Create Courses.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             duration:
 *               type: number
 *             fees:
 *               type: number
 *     responses:
 *       200: 
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/update/:id', auth, authorize('admin'), courseController.updateCourse);

/**
 * @swagger
 * /api/course/delete/{id}:
 *   delete:
 *     summary: Delete course (Admin only)
 *     tags: 
 *       - Courses
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
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.delete('/delete/:id', auth, authorize('admin'), courseController.deleteCourse);

export default route;