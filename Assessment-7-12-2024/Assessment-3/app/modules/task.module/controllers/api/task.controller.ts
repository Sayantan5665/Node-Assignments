import { Request, Response } from "express";
import taskRepo from "../../repositories/task.repositories";
import { ICategory, ILabel, IReminder, ITask, ITokenUser, IUser } from "@interfaces";
import categoryRepo from "app/modules/category.module/repositories/category.repositories";
import { Types } from "mongoose";
import labelRepo from "app/modules/label.module/repositories/label.repositories";
import reminderRepo from "app/modules/reminder.module/repositories/reminder.repositories";
import { agenda } from "@utils";

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

            if (task.userId.toString() !== user.id) {
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

            // If due time was changed, update the reminder
            if (body.due && new Date(new Date(body.due.date).toLocaleDateString() + '-' + body.due.time).getTime() !== new Date(new Date(task.due.date).toLocaleDateString() + '-' + task.due.time).getTime()) {

                // Find the associated reminder
                const reminder = (await reminderRepo.fetchReminder({isActive: true, taskId: new Types.ObjectId(taskId)}))[0];

                if (reminder) {
                    // Cancel the old reminder job in Agenda
                    await agenda.cancel({ "data.reminderId": reminder._id });

                    // Calculate new reminder time
                    const newReminderTime = new Date(new Date(new Date(body.due.date).toLocaleDateString() + '-' + body.due.time).getTime() - reminder.remindBefore * 60 * 1000);

                    if (newReminderTime > new Date()) {
                        // Schedule a new reminder job
                        await agenda.schedule(newReminderTime, "send reminder email", { reminderId: reminder._id });
                        console.log(`Rescheduled reminder for task ${taskId} at ${newReminderTime}`);
                    } else {
                        console.log(`New reminder time is in the past, sending email immediately.`);
                        await agenda.now("send reminder email", { reminderId: reminder._id });
                    }
                }
            }

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

            const reminder: any = (await reminderRepo.fetchReminder({ isActive: false, taskId: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!reminder) {
                console.log("Reminder not found");
            } else {
                await reminderRepo.deleteReminder(new Types.ObjectId(reminder._id as string), new Types.ObjectId(taskId), new Types.ObjectId(user.id));
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

            const task: ITask | undefined | null = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            const isTaskCompleted: ITask | undefined | null = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id), status: 'complete' }))[0];
            if (isTaskCompleted) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task is already completed!',
                });
            }

            const markedTask: ITask | null = await taskRepo.markTask(user, new Types.ObjectId(taskId), 'complete');
            if (!markedTask) {
                return res.status(400).json({
                    status: 400,
                    message: 'Task not found!',
                    data: isTaskCompleted
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Task marked as completed!',
                data: markedTask
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

            const isTaskPending: ITask | undefined | null = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id), status: 'pending' }))[0];
            if (isTaskPending) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task is already marked as pending!',
                    data: isTaskPending
                });
            }

            const markedTask: ITask | null = await taskRepo.markTask(user, new Types.ObjectId(taskId), 'pending');
            if (!markedTask) {
                return res.status(400).json({
                    status: 400,
                    message: 'Task not found!',
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Task marked as pending!',
                data: markedTask
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