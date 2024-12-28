import { IUser, IMailOptions, IVerificationToken } from "../interfaces/user.interface";
import { userModel, userValidator } from "../models/user.model";

export const userRepo = {
    findOneBy: async (key:string, value: string):Promise<IUser | null> => {
        try {
            const user: Array<IUser> = await userModel.aggregate([
                { $match: { [key]: value } },
                {
                    $project: {
                        _id: 1,
                        image: 1,
                        name: 1,
                        email: 1,
                        password: 1,
                        role: 1,
                        isVarified: 1,
                        isActive: 1,
                        timeZone: 1,
                        createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        // updatedAt: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
                    }
                }
            ]);
            return user.length > 0? user[0] : null;
        } catch (error: any) {
            throw new Error(error.message || 'Something went wrong while finding user!');
        }
    }
}