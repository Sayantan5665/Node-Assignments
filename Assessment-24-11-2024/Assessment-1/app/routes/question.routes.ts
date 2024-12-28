import { Router } from 'express';
import questionsController from '../controllers/questions.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

// Question routes
router.post('/create', auth, questionsController.createQuestion);
router.get('/fetch/category-wise', questionsController.getAllQuestionCategoryWise);
router.get('/fetch/with-answer/:questionId', questionsController.getQuestionwithAnswers);
router.get('/fetch/:id', questionsController.getQuestionByCategoryId);

export default router;


// router.get('/categories/:categoryId/questions', auth, questionController.getQuestionsByCategory);
// router.post('/questions/:questionId/answers', auth, questionController.submitAnswer);
// router.get('/questions/search', auth, questionController.searchQuestions);
// router.get('/categories', auth, questionController.getCategoriesWithCount);