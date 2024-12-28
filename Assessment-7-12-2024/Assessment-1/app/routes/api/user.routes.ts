import { Router } from 'express';
import userController from 'app/modules/user.module/api/controllers/user.controller';
import { auth } from "@middlewares";
import { upload } from '@utils';
const route = Router();

route.post('/register', upload.single('image'), userController.createUser);
route.post('/login', userController.loginUser);
route.get('/fetch/profile/:id', auth, userController.getUserProfile);
route.put('/update/user/:id', auth, upload.single('image'), userController.updateUserProfile);
route.get('/logout', auth, userController.logoutUser);

export default route;