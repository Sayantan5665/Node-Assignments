import { Router } from 'express';
import taskController from 'app/modules/task.module/controllers/api/task.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/task/create:
 *   post:
 *     summary: Create label (User themselves only)
 *     tags:
 *       - Task
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Create label
 *         description: Create label.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - description
 *             - priority
 *             - due
 *             - categoryId
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             priority:
 *               type: string
 *               enum:
 *                 - low
 *                 - medium
 *                 - high
 *             due:
 *               type: object
 *               required:
 *                 - date
 *                 - time
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 time: 
 *                   type: string
 *             categoryId:
 *               type: string
 *             labels:
 *               type: array
 *               items: 
 *                 type: string
 *                 required: true
 *             status:
 *               type: string
 *               enum:
 *                 - pending
 *                 - complete
 *             location:
 *               type: string
 *             color:
 *               type: string
 *               description: hex color only
 *     responses:
 *        200:
 *          description: Label created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, taskController.createTask);

/**
 * @swagger
 * /api/task/fetch/all:
 *   get:
 *     summary: Fetch all the tasks (User themselves only)
 *     tags: 
 *       - Task
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All tasks fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all', auth, taskController.getAllTasks);

/**
 * @swagger
 * /api/task/fetch/all/pending:
 *   get:
 *     summary: Fetch all the pending tasks (User themselves only)
 *     tags: 
 *       - Task
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All pending tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All pending tasks fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all/pending', auth, taskController.getPendingTasks);

/**
 * @swagger
 * /api/task/fetch/all/completed:
 *   get:
 *     summary: Fetch all the completed tasks (User themselves only)
 *     tags: 
 *       - Task
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All completed tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All completed tasks fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all/completed', auth, taskController.getCompletedTasks);

/**
 * @swagger
 * /api/task/fetch/{id}:
 *   get:
 *     summary: Fetch task by id (User themselves only)
 *     tags: 
 *       - Task
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
 *         description: Task fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/:id', auth, taskController.getTaskById);

/**
 * @swagger
 * /api/task/fetch/by-category/{categoryId}:
 *   get:
 *     summary: Fetch task by category (User themselves only)
 *     tags: 
 *       - Task
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Task fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task fetched successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/by-category/:categoryId', auth, taskController.getTaskByCategoryId);

/**
 * @swagger
 * /api/task/edit/{id}:
 *   put:
 *     summary: Edit task (User themselves only)
 *     tags: 
 *       - Task
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: Create label
 *         description: Create label.
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             priority:
 *               type: string
 *               enum:
 *                 - low
 *                 - medium
 *                 - high
 *             due:
 *               type: object
 *               required:
 *                 - date
 *                 - time
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 time: 
 *                   type: string
 *             categoryId:
 *               type: string
 *             labels:
 *               type: array
 *               items: 
 *                 type: string
 *                 required: true
 *             status:
 *               type: string
 *               enum:
 *                 - pending
 *                 - complete
 *             order:
 *               type: string
 *             location:
 *               type: string
 *             color:
 *               type: string
 *               description: hex color only
 *     responses:
 *       200: 
 *         description: task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: task updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:id', auth, taskController.updateTask);

/**
 * @swagger
 * /api/task/delete/{id}:
 *   delete:
 *     summary: Delete task (User themselves only)
 *     tags: 
 *       - Task
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
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.delete('/delete/:id', auth, taskController.deleteTask);

/**
 * @swagger
 * /api/task/mark-pending/{id}:
 *   put:
 *     summary: Edit task (User themselves only)
 *     tags: 
 *       - Task
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
 *         description: Task marked as pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task marked as pending
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:id', auth, taskController.markTaskAsPending);

/**
 * @swagger
 * /api/task/mark-completed/{id}:
 *   put:
 *     summary: Edit task (User themselves only)
 *     tags: 
 *       - Task
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
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task marked as completed
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:id', auth, taskController.markTaskAsCompleted);


export default route;