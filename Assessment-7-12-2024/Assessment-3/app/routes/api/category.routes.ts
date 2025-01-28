import { Router } from 'express';
import categoryController from 'app/modules/category.module/controllers/api/category.controller';
import { auth, authorize } from "@middlewares";
const route = Router();

/**
 * @swagger
 * /api/category/create:
 *   post:
 *     summary: Create Category (Admin Only)
 *     tags:
 *       - Category
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Create Category
 *         description: Create Category.
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
 *          description: Category created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/create', auth, authorize('admin'), categoryController.createCategory);


/**
 * @swagger
 * /api/category/fetch:
 *   get:
 *     summary: Fetch all the categories
 *     tags: 
 *       - Category
 *     security:
 *       - token: []
 *     produces: application/json
 *     responses:
 *       200: 
 *         description: All categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All categories fetched
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.get('/fetch', auth, categoryController.getCategory);

/**
 * @swagger
 * /api/category/edit/{id}:
 *   put:
 *     summary: Edit category (Admin Only)
 *     tags: 
 *       - Category
 *     security:
 *       - token: []
 *     produces: application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: Edit Category
 *         description: Edit Category.
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
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.put('/edit/:id', auth, authorize('admin'), categoryController.updateCategory);

/**
 * @swagger
 * /api/category/delete/{id}:
 *   delete:
 *     summary: Delete category (Admin Only)
 *     tags: 
 *       - Category
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
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
route.delete('/delete/:id', auth, authorize('admin'), categoryController.deleteCategory);

export default route;