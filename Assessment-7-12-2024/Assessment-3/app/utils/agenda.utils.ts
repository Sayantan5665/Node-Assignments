import Agenda, { Job } from "agenda";
import reminderRepo from "app/modules/reminder.module/repositories/reminder.repositories";
import { IMailOptions } from "@interfaces";
import { Types } from "mongoose";
import { sendVerificationEmail } from "@utils";

// MongoDB connection
const mongodb_uri: string = 'mongodb+srv://singhasayantan56:LPGilAhA4FN1gvoH@cluster0.wmkkeag.mongodb.net/' + process.env.MONGO_NAME;
console.log("mongodb_uri: ", mongodb_uri);

const agenda = new Agenda({
    db: { address: mongodb_uri, collection: "reminder-notification-agenda" }
});

// Define Reminder Job
agenda.define("send-reminder-email", async (job: Job) => {
    const { reminderId } = job.attrs.data;

    const reminder: any = (await reminderRepo.fetchReminder({ isActive: true, _id: new Types.ObjectId(reminderId as string) }))[0];

    if (!reminder || !reminder.taskId || !reminder.userId) return;

    const user = reminder.user;
    const taskName = reminder.task.title;
    const taskTime = reminder.task.due; // Assume `time` is stored as a Date in Task

    // Send email
    const mailOptions: IMailOptions = {
        from: "no-reply@sayantan.com",
        to: user.email,
        subject: "Task Reminder",
        html: `
            <h1>Hello, ${user.name}</h1>
            <h4>Reminder:</h4>
            <p>&ensp;Your task "${taskName}" is scheduled on ${new Date(taskTime.date).toLocaleDateString()} at ${reminder.task.time}.</p>
            <br>
            <p>Thank you!</p>
        `
    };

    await sendVerificationEmail(mailOptions);

    console.log(`Reminder email sent to ${user.email}, Message: Your task "${taskName}" is scheduled on ${new Date(taskTime.date).toLocaleDateString()} at ${reminder.task.time}.`);
});

// Function to recover reminders on startup
const recoverReminders = async () => {
    console.log("Recovering scheduled reminders...");

    // Fetch all reminders that are still in the future
    const now = new Date();
    const reminders: any = (await reminderRepo.fetchReminder({ isActive: true }));

    for (const reminder of reminders) {
        if (!reminder?.task?._id) continue;


        const taskTime = new Date(new Date(reminder.task.due.date).toLocaleDateString() + '-' + reminder.task.due.time);
        const remindTime = new Date(taskTime.getTime() - reminder.remindBefore * 60 * 1000);

        if (remindTime > now) {
            // Reschedule future one-time reminders
            if (reminder.type === "no repeat") {
                await agenda.schedule(remindTime, "send reminder email", { reminderId: reminder._id });
                console.log(`Rescheduled reminder for ${reminder._id}`);
            }
        } else {
            // If the reminder time has already passed, send it immediately
            await agenda.now("send reminder email", { reminderId: reminder._id });
            console.log(`Missed reminder executed immediately for ${reminder._id}`);
        }
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
