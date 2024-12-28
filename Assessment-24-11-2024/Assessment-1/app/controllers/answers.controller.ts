import { IAnswer } from "../interfaces/answer.interface";
import answerRepo from "../repositories/answer.repository";
import { Request, Response } from 'express';

class answerController {
    async submitAnswer (req: Request, res: Response): Promise<void> {
        try {
            const { questionId } = req.params;
            const { content } = req.body;
            const body:any = {
                question: questionId,
                user: req.user?.id,
                content,
                userTimezone: req.user?.timeZone
            }
            const answer:IAnswer|null = await answerRepo.save(body);
            res.status(201).json(answer);
        } catch (error) {
            res.status(500).json({ message: 'Error submitting answer', error });
        }
    }
}

export default new answerController();