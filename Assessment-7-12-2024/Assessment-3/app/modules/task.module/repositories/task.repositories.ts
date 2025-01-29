import { ITask, ITokenUser } from "@interfaces";
import { taskModel, taskValidator } from "../models/task.model";
import { Types } from "mongoose";

class taskRepo {
    async addTask(body: ITask): Promise<ITask> {
        try {
            const maxOrder: Array<ITask | null> = await taskModel.find({ isActive: true }).sort({ order: -1 }).limit(1);
            const newOrder: number = maxOrder?.length ? (maxOrder[0] ? maxOrder[0].order + 1 : 1) : 1;
            body.order = newOrder;


            const { error } = taskValidator.validate(body);
            if (error) throw error;

            const data = new taskModel(body);
            const newCategory: ITask = await data.save();
            return newCategory;
        } catch (error) {
            throw error;
        }
    }

    async fetchTask(matchConditions: { isActive: boolean, userId: Types.ObjectId } & Record<string, any>): Promise<Array<ITask>> {
        try {
            const categories: Array<ITask> = await taskModel.aggregate([
                {
                    $match: matchConditions
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "labels",
                        localField: "labels",
                        foreignField: "_id",
                        as: "label"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        title: 1,
                        description: 1,
                        priority: 1,
                        due: 1,
                        category: {
                            _id: 1,
                            title: 1,
                            description: 1
                        },
                        label: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            color: 1
                        },
                        status: 1,
                        order: 1,
                        location: 1,
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
            return categories;
        } catch (error) {
            throw error;
        }
    }


    async updateTask(user: ITokenUser, task: ITask, taskId: Types.ObjectId, body: ITask): Promise<ITask> {
        try {
            if (body.order) {
                // If order is being updated
                if (body.order !== task.order) {
                    const oldOrder = task.order;
                    const newOrder = body.order;

                    // Update other tasks' orders
                    if (oldOrder < newOrder) {
                        // Moving task down: decrease order of tasks between old and new position
                        const x = await taskModel.updateMany(
                            {
                                userId: user.id,
                                order: { $gt: oldOrder, $lte: newOrder }
                            },
                            { $inc: { order: -1 } }
                        );
                    } else {
                        // Moving task up: increase order of tasks between new and old position
                        const y = await taskModel.updateMany(
                            {
                                userId: user.id,
                                order: { $gte: newOrder, $lt: oldOrder }
                            },
                            { $inc: { order: 1 } }
                        );
                    }
                }
            }

            const updatedCategory: ITask | null = await taskModel.findOneAndUpdate({ isActive: true, _id: taskId, userId: user.id }, body, { new: true });
            if (!updatedCategory) throw new Error('Something went wrong when updating task');

            return updatedCategory;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(user: ITokenUser, taskId: Types.ObjectId): Promise<any> {
        try {
            await taskModel.findOneAndUpdate({ isActive: true, _id: taskId, userId: user.id }, { isActive: false });
        } catch (error) {
            throw error;
        }
    }

    async markTask(user: ITokenUser, taskId: Types.ObjectId, as: 'pending' | 'complete'): Promise<ITask | null> {
        try {
            const markedTask: ITask | null = await taskModel.findOneAndUpdate({ isActive: true, _id: taskId, userId: user.id }, { status: as }, { new: true });
            return markedTask;
        } catch (error) {
            throw error;
        }
    }
}

export default new taskRepo();