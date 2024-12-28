import { Router } from 'express';
import userController from '../modules/auth.module/controllers/user.controller';
import upload from '../helpers/imageUpload.helper';
import { auth } from '../middlewares/auth.middleware';
const route = Router();

route.post('/register', upload.single('image'), userController.createUser);
route.post('/login', userController.loginUser);
route.get('/fetch/profile/:id', auth,userController.getUserProfile);
route.put('/update/user/:id', auth, upload.single('image'), userController.updateUserProfile);
route.get('/logout', auth, userController.logoutUser);

export default route;