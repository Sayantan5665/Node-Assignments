import batchRepository from "app/modules/batch.module/repositories/batch.repository";
import { attendanceModel, attendanceValidator } from "../models/attendance.model";
import { IAttendance, IBatch } from "@interfaces";
import { Types } from "mongoose";

class attendanceRepository {
    async addUpdateAttendance(body: IAttendance): Promise<IAttendance> {
        try {
            const batch = await batchRepository.getBatchById(body.batchId.toString());
            if (!batch) throw new Error('Batch not found');

            if (batch.teacher._id.toString() !== body.markedBy.toString()) {
                throw new Error('Only the assigned teacher can mark attendance.');
            }

            // generateing a unique id for checking attendance for each day
            const givenDate = new Date(body.date);
            const day = String(givenDate.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
            const month = String(givenDate.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad
            const year = givenDate.getFullYear(); // Get full year
            const uniqueId = body.batchId+`-${day}-${month}-${year}`;

            const existingAttendance: IAttendance | null = await attendanceModel.findOne({
                batchId: new Types.ObjectId(body.batchId),
                uniqueId: uniqueId,
            });

            if((new Date()).setHours(0, 0, 0, 0) < givenDate.setHours(0, 0, 0, 0)) {
                throw new Error('You cannot mark attendance for future.');
            }

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

                const updatedAttendance: IAttendance | null = await attendanceModel.findByIdAndUpdate(existingAttendance._id, existingAttendance, {new: true});
                return updatedAttendance || {} as IAttendance;
            }


            body.uniqueId = uniqueId;
            const { error } = attendanceValidator.validate(body);
            if (error) throw error;

            const newAttendance = new attendanceModel(body);  // If no existing attendance, create a new record
            return await newAttendance.save();
        } catch (error) {
            throw error;
        }
    }




    /**
     * Fetch attendance records by:
     ** Student (for a specific course or batch).
     */
    async getAttendanceRecordsByStudent(studentId: string, batchId?: string): Promise<IAttendance[]> {
        try {
            const attendanceRecords: IAttendance[] = await attendanceModel.aggregate([
                {
                    $match: {
                        batchId: batchId
                    }
                },
                {
                    $lookup: {
                        from: 'batches',
                        localField: 'batchId',
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
            const attendancePercentage: IAttendance[] = await attendanceModel.aggregate([
                { $match: { batchId: batchId } },
                { $unwind: "$records" },
                {
                    $group: {
                        _id: "$records.student", // Group by student ID
                        total: { $sum: 1 }, // Count total attendance records
                        present: {
                            $sum: { $cond: [{ $eq: ["$records.status", "present"] }, 1, 0] },
                        }, // Count 'present' records
                    },
                },
                {
                    $lookup: {
                        from: "users", // Assuming the 'User' collection is named 'users'
                        localField: "_id",
                        foreignField: "_id",
                        as: "studentDetails",
                    },
                },
                {
                    $unwind: "$studentDetails", // Unwind student details
                },
                {
                    $project: {
                        studentId: "$_id",
                        name: "$studentDetails.name", // Include student name
                        attendancePercentage: {
                            $multiply: [{ $divide: ["$present", "$total"] }, 100],
                        }, // Calculate percentage
                    },
                },
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
                        localField: 'batchId',
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
                        batchId: { $first: "$batchId" },
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