import { Router } from 'express';
import userController from 'app/modules/user.module/controllers/api/user.controller';
import { auth } from "@middlewares";
import { upload } from '@utils';
const route = Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register user
 *     tags:
 *       - Auth
 *     security: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *       - in: formData
 *         name: confirmPassword
 *         type: string
 *         required: true
 *     schema:
 *       type: object
 *       required:
 *         - email
 *         - password 
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 *     responses:
 *        200:
 *          description: User register successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/register', upload.single('image'), userController.createUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     security: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: User Login
 *         description: User login.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *        200:
 *          description: User login successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.post('/login', userController.loginUser);


/**
  * @swagger
  * /api/user/fetch/profile/{id}:
  *   get:
  *     summary: User details
  *     tags:
  *       - Auth
  *     security:
  *       - token: []
  *     produces:
  *       - application/json
  *     parameters:
  *       - in: path
  *         name: id
  *         type: string
  *         required: true
  *     responses:
  *       200: 
  *         description: User details fetched successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: User details fetched successfully
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
route.get('/fetch/profile/:id', auth, userController.getUserProfile);

/**
 * @swagger
 * /api/user/update/{id}:
 *   post:
 *     summary: Edit user details
 *     tags:
 *       - Auth
 *     security:
 *       - token: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *       - in: formData
 *         name: name
 *         type: string
 *       - in: formData
 *         name: email
 *         type: string
 *       - in: formData
 *         name: password
 *         type: string
 *       - in: formData
 *         name: confirmPassword
 *         type: string
 *         description: Add user in MongoDB.
 *         schema:
 *           type: object
 *           properties:
 *             image:
 *               type: file
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             confirmPassword:
 *               type: string
 *     responses:
 *        200:
 *          description: Profile updated successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
*/
route.put('/update/:id', auth, upload.single('image'), userController.updateUserProfile);

/**
  * @swagger
  * /api/user/logout:
  *   get:
  *     summary: User logout
  *     tags:
  *       - Auth
  *     security:
  *       - token: []
  *     produces:
  *       - application/json
  *     responses:
  *       200: 
  *         description: Logged out successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Logged out successfully
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
route.get('/logout', auth, userController.logoutUser);

/**
  * @swagger
  * /api/user/account/confirmation/{token}:
  *   get:
  *     summary: User email confirmation
  *     tags:
  *       - Auth
  *     security: []
  *     produces:
  *       - application/json
  *     parameters:
  *       - in: path
  *         name: token
  *         type: string
  *     responses:
  *       200: 
  *         description: Email verified successfully! You can now login.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                   example: Email verified successfully! You can now login.
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
route.get('/account/confirmation/:token', userController.verifyEmail);

export default route;