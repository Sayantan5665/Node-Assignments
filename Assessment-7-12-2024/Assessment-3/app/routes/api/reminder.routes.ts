import { Router } from 'express';
import reminderController from 'app/modules/reminder.module/controllers/api/reminder.controller';
import { auth } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/reminder/add/{taskId}:
 *   post:
 *     summary: Add reminder (User themselves only)
 *     tags:
 *       - Reminder
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: taskId
 *         type: string
 *         required: true
 *       - in: body
 *         name: Add reminder
 *         description: Add reminder.
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - remindBefore
 *           properties:
 *             type:
 *               type: string
 *               enum:
 *                 - no repeat
 *                 - every week
 *                 - every month
 *                 - every year
 *             remindBefore:
 *               type: number
 *               description: minutes
 *     responses:
 *        200:
 *          description: Label created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/add/:taskId', auth, reminderController.createReminder);

/**
 * @swagger
 * /api/reminder/fetch/all:
 *   get:
 *     summary: Fetch all the reminders (User themselves only)
 *     tags: 
 *       - Reminder
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All reminders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All reminders fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/all', auth, reminderController.getAllReminders);

/**
 * @swagger
 * /api/reminder/fetch/by-task/{taskId}:
 *   get:
 *     summary: Fetch reminders by category (User themselves only)
 *     tags: 
 *       - Reminder
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: taskId
 *         type: string
 *         required: true
 *     responses:
 *       200: 
 *         description: Reminders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reminders fetched successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch/by-task/:taskId', auth, reminderController.getReminderByTaskId);

/**
 * @swagger
 * /api/reminder/edit/{taskId}/{reminderId}:
 *   put:
 *     summary: Edit reminder (User themselves only)
 *     tags: 
 *       - Reminder
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: taskId
 *         type: string
 *         required: true
 *       - in: path
 *         name: reminderId
 *         type: string
 *         required: true
 *       - in: body
 *         name: Add reminder
 *         description: Add reminder.
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - remindBefore
 *           properties:
 *             type:
 *               type: string
 *               enum:
 *                 - no repeat
 *                 - every week
 *                 - every month
 *                 - every year
 *             remindBefore:
 *               type: number
 *               description: minutes
 *     responses:
 *       200: 
 *         description: Reminder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reminder updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:taskId/:reminderId', auth, reminderController.updateReminder);


export default route;