import { Router } from 'express';
import labelController from 'app/modules/label.module/controllers/api/label.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/label/create:
 *   post:
 *     summary: Create label (Admin Only)
 *     tags:
 *       - Label
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
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *        200:
 *          description: Label created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, authorize('admin'), labelController.createLabel);


/**
 * @swagger
 * /api/label/fetch:
 *   get:
 *     summary: Fetch all the labels
 *     tags: 
 *       - Label
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All labels fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All labels fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch', auth, labelController.getLabel);

/**
 * @swagger
 * /api/label/edit/{id}:
 *   put:
 *     summary: Edit label (Admin Only)
 *     tags: 
 *       - Label
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: Edit label
 *         description: Edit label.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - description
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200: 
 *         description: Label updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Label updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:id', auth, authorize('admin'), labelController.updateLabel);

/**
 * @swagger
 * /api/label/delete/{id}:
 *   delete:
 *     summary: Delete label (Admin Only)
 *     tags: 
 *       - Label
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
 *         description: Label deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Label deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.delete('/delete/:id', auth, authorize('admin'), labelController.deleteLabel);

export default route;