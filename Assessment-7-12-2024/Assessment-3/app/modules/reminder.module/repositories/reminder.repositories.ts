import { IReminder, ITokenUser } from "@interfaces";
import { reminderModel, reminderValidator } from "../models/reminder.model";
import { Types } from "mongoose";

class taskRepo {
    async addReminder(body: IReminder): Promise<IReminder> {
        try {
            const { error } = reminderValidator.validate(body);
            if (error) throw error;

            const data = new reminderModel(body);
            const reminder: IReminder = await data.save();
            return reminder;
        } catch (error) {
            throw error;
        }
    }

    async fetchReminder(matchConditions: { userId: Types.ObjectId } & Record<string, any>): Promise<Array<IReminder>> {
        try {
            const reminders: Array<IReminder> = await reminderModel.aggregate([
                {
                    $match: matchConditions
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "tasks",
                        localField: "taskId",
                        foreignField: "_id",
                        as: "task"
                    }
                },
                {
                    $unwind: {
                        path: "$task",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            email: 1,
                        },
                        task: {
                            _id: 1,
                            userId: 1,
                            title: 1,
                            description: 1,
                            priority: 1,
                            due: 1,
                            categoryId: 1,
                            labels: 1,
                            status: 1,
                        },
                        type: 1,
                        remindBefore: 1,
                    }
                }
            ]);
            return reminders;
        } catch (error) {
            throw error;
        }
    }


    async updateReminder(reminderId: Types.ObjectId, body: IReminder): Promise<IReminder | null> {
        try {
            const updatedCategory: IReminder | null = await reminderModel.findOneAndUpdate({ _id: reminderId, userId: new Types.ObjectId(body.userId), taskId: new Types.ObjectId(body.taskId) }, body, { new: true });
            return updatedCategory;
        } catch (error) {
            throw error;
        }
    }
}

export default new taskRepo();