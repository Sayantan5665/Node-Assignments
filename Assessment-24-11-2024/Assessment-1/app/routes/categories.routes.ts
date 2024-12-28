import { Router } from 'express';
import categoriesController from '../controllers/categories.controller';
import { adminAccess } from '../middlewares/auth.middleware';

const router = Router()


router.post('/create', adminAccess, categoriesController.createCategory);
router.get('/fetch/category-with-question-count', categoriesController.getAllCategoryWithQuestionsCount);


export default router;
