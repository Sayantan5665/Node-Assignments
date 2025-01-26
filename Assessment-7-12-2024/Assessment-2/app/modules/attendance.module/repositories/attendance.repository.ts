import batchRepository from "app/modules/batch.module/repositories/batch.repository";
import { attendanceModel, attendanceValidator } from "../models/attendance.model";
import { IAttendance, IBatch } from "@interfaces";
import { Types } from "mongoose";

class attendanceRepository {
    // async addUpdateAttendance(body: IAttendance): Promise<IAttendance> {
    //     try {
    //         const batch: IBatch | null = await batchRepository.getBatchById(body.batch.toString());
    //         if (!batch) throw new Error('Batch not found');

    //         if (batch.teacherId.toString() != body.markedBy.toString()) { throw new Error('Only assign teacher can mark attendance.'); }

    //         const { error } = attendanceValidator.validate(body);
    //         if (error) throw error;

    //         const existingAttendance:IAttendance|null = await attendanceModel.findOne({
    //             batch: body.batch,
    //             date: body.date
    //         });

    //         if (existingAttendance) {
    //             // check if student is already marked and if marked update attendance status with new one
    //             body.records.forEach((record, index) => {
    //                 if (existingAttendance.records.find(r => r.student.toString() === record.student.toString())) {
    //                     // already marked
    //                     existingAttendance.records[index].status = record.status;
    //                 } else {
    //                     // not marked yet
    //                     existingAttendance.records.push(record);
    //                 }
    //             })
    //             body = existingAttendance;
    //         }

    //         const data = new attendanceModel(body);
    //         const newAttendance: IAttendance = await data.save();
    //         return newAttendance;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async addUpdateAttendance(body: IAttendance): Promise<IAttendance> {
        try {
            const batch: IBatch | null = await batchRepository.getBatchById(body.batch.toString());
            if (!batch) throw new Error('Batch not found');

            if (batch.teacherId.toString() !== body.markedBy.toString()) {
                throw new Error('Only the assigned teacher can mark attendance.');
            }

            const { error } = attendanceValidator.validate(body);
            if (error) throw error;

            const existingAttendance: IAttendance | null = await attendanceModel.findOne({
                batch: body.batch,
                date: body.date,
            });

            if (existingAttendance) {
                // Create a Map for quick student lookup
                const existingRecordsMap = new Map(
                    existingAttendance.records.map(record => [record.student.toString(), record])
                );

                body.records.forEach(record => {
                    const existingRecord = existingRecordsMap.get(record.student.toString());
                    if (existingRecord) {
                        existingRecord.status = record.status;    // Update status if already marked
                    } else {
                        existingAttendance.records.push(record);    // Add new record if not already marked
                    }
                });

                const updatedAttendance: IAttendance = await existingAttendance.save();
                return updatedAttendance;
            }

            const newAttendance = new attendanceModel(body);  // If no existing attendance, create a new record
            return await newAttendance.save();
        } catch (error) {
            throw error;
        }
    }

    /** From ChatGPT */
    // async addUpdateAttendance(body: IAttendance): Promise<IAttendance> {
    //     try {
    //         // Validate batch
    //         const batch: IBatch | null = await batchRepository.getBatchById(body.batch.toString());
    //         if (!batch) throw new Error('Batch not found');

    //         // Ensure only the assigned teacher can mark attendance
    //         if (batch.teacherId.toString() !== body.markedBy.toString()) {
    //             throw new Error('Only the assigned teacher can mark attendance.');
    //         }

    //         // Validate the attendance body
    //         const { error } = attendanceValidator.validate(body);
    //         if (error) throw new Error(`Validation Error: ${error.message}`);

    //         // Process each record efficiently
    //         for (const record of body.records) {
    //             await attendanceModel.updateOne(
    //                 { batch: body.batch, date: body.date, "records.student": record.student },
    //                 {
    //                     $set: { "records.$.status": record.status }, // Update the status of existing records
    //                 },
    //                 { upsert: false } // Do not create if the record doesn't exist
    //             );

    //             // Add the record if it doesn't already exist
    //             await attendanceModel.updateOne(
    //                 { batch: body.batch, date: body.date },
    //                 {
    //                     $addToSet: { records: record }, // Add record only if not present
    //                 },
    //                 { upsert: true } // Create the document if it doesn't exist
    //             );
    //         }

    //         // Fetch and return the updated attendance document
    //         const updatedAttendance = await attendanceModel.findOne({
    //             batch: body.batch,
    //             date: body.date,
    //         });

    //         return updatedAttendance as IAttendance;
    //     } catch (error) {
    //         throw new Error(`Attendance Error: ${error.message}`);
    //     }
    // }






    /**
     * Fetch attendance records by:
     ** Student (for a specific course or batch).
     */
    async getAttendanceRecordsByStudent(studentId: string, batchId?: string): Promise<IAttendance[]> {
        try {
            const attendanceRecords: IAttendance[] = await attendanceModel.aggregate([
                {
                    $match: {
                        batch: batchId
                    }
                },
                {
                    $lookup: {
                        from: 'batches',
                        localField: 'batch',
                        foreignField: '_id',
                        as: 'batchInfo'
                    }
                },
                {
                    $unwind: "$records"
                },
                {
                    $match: {
                        "records.student": studentId
                    }
                }, {
                    $project: {
                        date: 1,
                        student: "$records.student",
                        status: "$records.status",
                        batchInfo: 1
                    }
                }
            ])
            return attendanceRecords;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Fetch attendance records by:
    ** Batch (view attendance percentage for all students).
    */
    async getAttendanceOfRecordsByBatch(batchId: string): Promise<IAttendance[]> {
        try {
            const attendancePercentage:IAttendance[] = await attendanceModel.aggregate([
                { $match: { batch: batchId } },
                { $unwind: "$records" },
                { 
                    $group: {
                        _id: "records.student",
                        total: { $sum: 1 }
                    } 
                }
                // {
                //     $group: {
                //         _id: "$records.student", // Group by student ID
                //         total: { $sum: 1 }, // Count total attendance records
                //         present: {
                //             $sum: { $cond: [{ $eq: ["$records.status", "present"] }, 1, 0] },
                //         }, // Count 'present' records
                //     },
                // },
                // {
                //     $lookup: {
                //         from: "users", // Assuming the 'User' collection is named 'users'
                //         localField: "_id",
                //         foreignField: "_id",
                //         as: "studentDetails",
                //     },
                // },
                // {
                //     $unwind: "$studentDetails", // Unwind student details
                // },
                // {
                //     $project: {
                //         studentId: "$_id",
                //         name: "$studentDetails.name", // Include student name
                //         attendancePercentage: {
                //             $multiply: [{ $divide: ["$present", "$total"] }, 100],
                //         }, // Calculate percentage
                //     },
                // },
            ]);
    
            return attendancePercentage;
        } catch (error) {
            throw error;
        }
    }

    /*** Get all Records (Admin/Teachers) */
    async geAllAttendanceRecords(): Promise<IAttendance[]> {
        try {
            const attendanceRecords: IAttendance[] = await attendanceModel.aggregate([
                {
                    $lookup: {
                        from: 'batches',
                        localField: 'batch',
                        foreignField: '_id',
                        as: 'batchInfo',
                    }
                },
                {
                    $unwind: "$records" // Unwind the records array to perform the lookup on each student record
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'records.student', // Reference the student field in records array
                        foreignField: '_id',
                        as: 'studentInfo', // Renamed the field to avoid collision with the `records` array
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        batch: { $first: "$batch" },
                        date: { $first: "$date" },
                        markedBy: { $first: "$markedBy" },
                        batchInfo: { $first: "$batchInfo" },
                        records: { $push: { student: "$studentInfo", status: "$records.status" } }, // Rebuild the records array
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'markedBy',
                        foreignField: '_id',
                        as: 'markedByInfo',
                    }
                },
                {
                    $project: {
                        batchInfo: 1,
                        markedByInfo: 1,
                        date: 1,
                        records: 1,
                    }
                }
            ]);

            return attendanceRecords;
        } catch (error) {
            throw error;
        }
    }
}

export default new attendanceRepository();