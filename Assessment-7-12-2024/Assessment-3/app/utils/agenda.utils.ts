import Agenda, { Job } from "agenda";
import reminderRepo from "app/modules/reminder.module/repositories/reminder.repositories";
import { IMailOptions } from "@interfaces";
import { Types } from "mongoose";
import { sendVerificationEmail } from "@utils";
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_NAME = process.env.MONGO_NAME;
const mongodb_uri: string = 'mongodb+srv://'+MONGO_USER+':'+MONGO_PASS+'@cluster0.wmkkeag.mongodb.net/'+MONGO_NAME;
console.log("mongodb_uri: ", mongodb_uri);

const agenda = new Agenda({
    db: { address: mongodb_uri, collection: "reminder-notification-agenda" }
});

// Define Reminder Job
agenda.define("send-reminder-email", async (job: Job) => {
    const { reminderId } = job.attrs.data;

    const reminder: any = (await reminderRepo.fetchReminder({ isActive: true, _id: new Types.ObjectId(reminderId as string) }))[0];

    if (!reminder || !reminder.task._id || !reminder.user.email) return;

    const user = reminder.user;
    const taskName = reminder.task.title;
    const taskTime = reminder.task.due; // Assume `time` is stored as a Date in Task

    // Send email
    const mailOptions: IMailOptions = {
        from: "no-reply@sayantan.com",
        to: user.email,
        subject: "Task Reminder",
        html: `
        <h1>Hello, ${user?.name}</h1>
        <h4>Reminder:</h4>
        <p>&ensp;Your task "${taskName}" is scheduled on ${new Date(taskTime.date).toDateString()} at ${taskTime.time}.</p>
        <br>
        <p>Thank you!</p>
        `
    };

    await sendVerificationEmail(mailOptions);

    console.log(`Reminder email sent to ${user.email}, Message: Your task "${taskName}" is scheduled on ${new Date(taskTime.date).toDateString()} at ${taskTime.time}.`);
});

// Function to recover reminders on startup
const recoverReminders = async () => {
    console.log("Recovering scheduled reminders...");

    // Fetch all reminders that are still in the future
    const now = new Date();
    const reminders: any = (await reminderRepo.fetchReminder({ isActive: true }));

    for (const reminder of reminders) {
        if (!reminder?.task?._id) continue;


        const taskTime = new Date(new Date(reminder.task.due.date).toDateString() + '-' + reminder.task.due.time);
        const remindTime = new Date(taskTime.getTime() - reminder.remindBefore * 60 * 1000);

        if (remindTime > now) {
            // Reschedule future one-time reminders
            // if (reminder.type === "no repeat") {
            //     await agenda.schedule(remindTime, "send-reminder-email", { reminderId: reminder._id });
            //     console.log(`Rescheduled reminder for ${reminder._id}`);
            // } else {
            //     await agenda.every(reminder.type, "send-reminder-email", { reminderId: reminder._id });
            //     console.log(`Recurring reminder scheduled for ${reminder._id}`);
            // }

            switch (reminder.type) {
                case "no repeat":
                    await agenda.schedule(remindTime, "send-reminder-email", { reminderId: reminder._id });
                    break;
            
                case "every week":
                    await agenda.create("send-reminder-email", { reminderId: reminder._id })
                        .repeatAt(remindTime.toISOString()) // First execution at remindTime
                        .repeatEvery("1 week") // Repeat every week
                        .save();
                    break;
            
                case "every month":
                    await agenda.create("send-reminder-email", { reminderId: reminder._id })
                        .repeatAt(remindTime.toISOString())
                        .repeatEvery("1 month")
                        .save();
                    break;
            
                case "every year":
                    await agenda.create("send-reminder-email", { reminderId: reminder._id })
                        .repeatAt(remindTime.toISOString())
                        .repeatEvery("1 year")
                        .save();
                    break;
            }
        } 
        // else {
        //     // If the reminder time has already passed, send it immediately
        //     await agenda.now("send-reminder-email", { reminderId: reminder._id });
        //     console.log(`Missed reminder executed immediately for ${reminder._id}`);
        // }
    }
};

// Start Agenda with Recovery
const startAgenda = async () => {
    await agenda.start();
    await recoverReminders(); // Ensure reminders are reloaded on startup
    console.log("Agenda started and reminders recovered!");
};

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("Stopping Agenda...");
    await agenda.stop();
    process.exit(0);
});

export { agenda, startAgenda };
