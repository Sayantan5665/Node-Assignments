import { Request, Response } from "express";
import taskRepo from "../../repositories/task.repositories";
import { ICategory, ILabel, ITask, ITokenUser, IUser } from "@interfaces";
import categoryRepo from "app/modules/category.module/repositories/category.repositories";
import { Types } from "mongoose";
import labelRepo from "app/modules/label.module/repositories/label.repositories";

class taskController {
    /*** (User themselves only) */
    async createTask(req: Request, res: Response): Promise<any> {
        try {
            const body = req.body;
            const user: ITokenUser = req.user!;

            const category: ICategory | null = await categoryRepo.fetchCategoryById(body.categoryId.toString());
            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: 'Category not found',
                });
            }

            body.userId = user.id;
            const notFoundLabel: Array<string> = [];
            if (body.labels) {
                const newLabel: string[] = [];
                await Promise.all(body.labels.map(async (labelId: string) => {
                    const label: ILabel | null = await labelRepo.fetchLabelById(labelId);
                    if (label) {
                        newLabel.push(labelId);
                    } else {
                        notFoundLabel.push(labelId);
                    }
                }));
                body.labels = newLabel;
            }

            const newTask: ITask = await taskRepo.addTask(body);
            res.status(200).json({
                status: 200,
                message: notFoundLabel?.length ? `Task created successfully! We could not find ${notFoundLabel.length} labels.` : 'Task created successfully',
                data: newTask,
            });
        } catch (error: any) {
            console.error("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            });
        }
    }

    /*** (User themselves only) */
    async getAllTasks(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const tasks: Array<ITask> = await taskRepo.fetchTask({ isActive: true, userId: new Types.ObjectId(user.id) });

            res.status(200).json({
                status: 200,
                message: 'Tasks fetched successfully!',
                data: tasks,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async getPendingTasks(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const tasks: Array<ITask> = await taskRepo.fetchTask({ isActive: true, userId: new Types.ObjectId(user.id), status: 'pending' });

            res.status(200).json({
                status: 200,
                message: 'Tasks fetched successfully!',
                data: tasks,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async getCompletedTasks(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const tasks: Array<ITask> = await taskRepo.fetchTask({ isActive: true, status: 'complete', userId: new Types.ObjectId(user.id) });

            res.status(200).json({
                status: 200,
                message: 'Tasks fetched successfully!',
                data: tasks,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async getTaskById(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const taskId = req.params.id;
            const tasks: Array<ITask> = await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) });

            if (!tasks.length || tasks[0] == null) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Tasks fetched successfully!',
                data: tasks[0],
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async getTaskByCategoryId(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const categoryId = req.params.categoryId;
            const tasks: Array<ITask> = await taskRepo.fetchTask({ isActive: true, categoryId: new Types.ObjectId(categoryId), userId: new Types.ObjectId(user.id) });

            if (!tasks.length || tasks[0] == null) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Tasks fetched successfully!',
                data: tasks,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async updateTask(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const body = req.body;
            const taskId = req.params.id;
            const notFoundLabel: Array<string> = [];

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            if (task.user._id.toString() !== user.id) {
                return res.status(401).json({
                    status: 401,
                    message: 'You cannot perform this action',
                });
            }

            if (body.categoryId) {
                const category: ICategory | null = await categoryRepo.fetchCategoryById(body.categoryId);
                if (!category) {
                    return res.status(404).json({
                        status: 404,
                        message: 'Category not found!',
                    });
                }
            }

            if (body.labels?.length) {
                body.labels = body.labels?.map(async (labelId: string) => {
                    if (await labelRepo.fetchLabelById(labelId.toString())) {
                        return new Types.ObjectId(labelId);
                    } else notFoundLabel.push(labelId);
                });
            }

            const updatedTask: ITask = await taskRepo.updateTask(user, task, new Types.ObjectId(taskId), body);

            res.status(200).json({
                status: 200,
                message: notFoundLabel?.length ? `Task updated successfully! We could not find ${notFoundLabel.length} labels.` : 'Task updated successfully!',
                data: updatedTask,
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async deleteTask(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const taskId = req.params.id;

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            await taskRepo.deleteTask(user, new Types.ObjectId(taskId));

            return res.status(200).json({
                status: 200,
                message: 'Task deleted successfully!'
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async markTaskAsCompleted(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const taskId = req.params.id;

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            await taskRepo.markTask(user, new Types.ObjectId(taskId), 'complete');

            return res.status(200).json({
                status: 200,
                message: 'Task marked as completed!'
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }

    /*** (User themselves only) */
    async markTaskAsPending(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const taskId = req.params.id;

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            await taskRepo.markTask(user, new Types.ObjectId(taskId), 'pending');

            return res.status(200).json({
                status: 200,
                message: 'Task marked as pending!'
            });
        } catch (error: any) {
            console.log("error: ", error);
            return res.status(500).json({
                status: 500,
                message: error.message || "Something went wrong! Please try again.",
                error: error,
            })
        }
    }
}

export default new taskController();