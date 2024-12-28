
import { answerModel, answerValidator } from '../models/answers.model';
import { IAnswer } from '../interfaces/answer.interface';
import commonRepo from './common.repository';

class categoryRepo extends commonRepo {
    constructor() {
        super(answerModel);
        // this.createCategory = this.createCategory.bind(this); //this is needed when createCategory is not arraow function
    }

    async save(data: IAnswer): Promise<IAnswer | null> {
        try {
            const { error } = answerValidator.validate(data);
            if (error) {
                throw error;
            }

            const newCategory: IAnswer | null = await this._save(data);
            return newCategory;
        } catch (error) {
            throw error;
        }
    }

    async findOneBy(param: any): Promise<IAnswer | null> {
        try {
            const user: Array<IAnswer> = await this._findOne(param);
            return user.length > 0 ? user[0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export default new categoryRepo();