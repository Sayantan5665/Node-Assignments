import { Request, Response } from "express";
import taskRepo from "../../../task.module/repositories/task.repositories";
import reminderRepo from "../../repositories/reminder.repositories";
import { IReminder, ITokenUser } from "@interfaces";
import { Types } from "mongoose";

class reminderController {
    /*** (User themselves only) */
    async createReminder(req: Request, res: Response): Promise<any> {
        try {
            const body: any = req.body;
            const taskId = req.params.taskId;
            const user: ITokenUser = req.user!;

            if(!taskId.length) {
                return res.status(400).json({
                    status: 400,
                    message: 'Task ID is required!',
                });
            }

            body.taskId = taskId;
            body.userId = user.id;

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            const reminder: IReminder = await reminderRepo.addReminder(body);
            res.status(200).json({
                status: 200,
                message: 'Reminder added successfully',
                data: reminder,
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
    async getAllReminders(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const Reminders: Array<IReminder> = await reminderRepo.fetchReminder({ userId: new Types.ObjectId(user.id) });

            return res.status(200).json({
                status: 200,
                message: 'Reminders fetched successfully!',
                data: Reminders,
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
    async getReminderByTaskId(req: Request, res: Response): Promise<any> {
        try {
            const taskId = req.params.taskId;
            const user: ITokenUser = req.user!;
            const Reminders: Array<IReminder> = await reminderRepo.fetchReminder({ taskId: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) });
            if (!Reminders?.length || !Reminders[0]) {
                return res.status(404).json({
                    status: 404,
                    message: 'Reminder not found!',
                });
            }

            return res.status(200).json({
                status: 200,
                message: 'Reminders fetched successfully!',
                data: Reminders,
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
    async updateReminder(req: Request, res: Response): Promise<any> {
        try {
            const user: ITokenUser = req.user!;
            const body = req.body;
            const { reminderId, taskId } = req.params;

            body.taskId = taskId;
            body.userId = user.id;

            const reminder: any = (await reminderRepo.fetchReminder({ _id: new Types.ObjectId(reminderId), userId: new Types.ObjectId(user.id), taskId: new Types.ObjectId(taskId) }))[0];
            if (!reminder) {
                return res.status(404).json({
                    status: 404,
                    message: 'Reminder not found!',
                });
            }

            const task: any = (await taskRepo.fetchTask({ isActive: true, _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(user.id) }))[0];
            if (!task) {
                return res.status(404).json({
                    status: 404,
                    message: 'Task not found!',
                });
            }

            const updatedReminder: IReminder | null = await reminderRepo.updateReminder(new Types.ObjectId(reminderId), body);
            if (!updatedReminder) {
                return res.status(404).json({
                    status: 400,
                    message: 'Something went wrong when updating Reminder',
                });
            };

            res.status(200).json({
                status: 200,
                message: 'Reminder updated successfully!',
                data: updatedReminder,
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

export default new reminderController();