import { Router } from 'express';
import answerController from '../controllers/answers.controller';
import { auth } from '../middlewares/auth.middleware';

const router:Router = Router();

router.post('/post/:questionId', auth, answerController.submitAnswer);

export default router;