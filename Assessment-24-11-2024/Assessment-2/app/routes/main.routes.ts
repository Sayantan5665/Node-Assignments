import { Router } from "express";
import userRoutes from "./user.routes";
import categoriesRoutes from "./categories.routes";
import userController from "../modules/auth.module/controllers/user.controller";

const router = Router();

router.use('/api/user', userRoutes);
router.use('/api/category', categoriesRoutes);

// only for email varification
router.get('/account/confirmation/:token', userController.verifyEmail);

export default router;