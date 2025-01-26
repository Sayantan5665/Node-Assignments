import { Types } from 'mongoose';
import { batchModel, batchValidator } from '../models/batch.model';
import { IBatch, ICourse, IEnrollment, IRole } from '@interfaces';
import courseModel from 'app/modules/course.module/models/course.model';
import userModel from 'app/modules/user.module/models/user.model';
import roleRepositories from 'app/modules/role.module/repositories/role.repositories';
import enrollmentModel from 'app/modules/enrollment.module/models/enrollment.model';


class batchRepository {
    async addBatch(body: Partial<IBatch>): Promise<IBatch> {
        try {
            const { error } = batchValidator.validate(body);
            if (error) throw error;

            const teacherRole: IRole | null = await roleRepositories.getRoleByRole('teacher')!;
            if (!teacherRole) {
                throw new Error('Cannot find teacher role');
            }

            const [course, teacher] = await Promise.all([
                courseModel.findById(body.courseId),
                userModel.findOne({ _id: body.teacherId, role: teacherRole._id })
            ]);

            if (!course) {
                throw new Error('Course not found');
            }

            if (!teacher) {
                throw new Error('Teacher not found');
            }

            const data = new batchModel(body);
            const newBatch: IBatch = await data.save();
            return newBatch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async assignStudentToBatch(studentId: string, batchId: string): Promise<IBatch> {
        try {
            const studentRole: IRole | null = await roleRepositories.getRoleByRole('student')!;
            if (!studentRole) {
                throw new Error('Cannot find teacher role');
            }
            const [batch, student] = await Promise.all([
                batchModel.findById(batchId),
                userModel.findOne({ _id: studentId, role: studentRole._id })
            ]);

            if (!batch) {
                throw new Error('Course not found');
            }

            if (!student) {
                throw new Error('Teacher not found');
            }


            // if (batch.students.includes(new Types.ObjectId(studentId))) {
            //     throw new Error('Student is already assigned to this batch');
            // }

            /*** using aggregate for practice */
            const existStudent = (await batchModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(batchId),
                        students: { $in: [new Types.ObjectId(studentId)] },
                    }
                },
                {
                    $lookup: {
                        from: 'users', // The collection storing student details
                        localField: 'students', // Field in the current collection (array of ObjectIds)
                        foreignField: '_id', // Field in the `users` collection (ObjectId)
                        as: 'studentDetails', // New field to hold the joined data
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        exist: {
                            $cond: [{ $in: [new Types.ObjectId(studentId), "$students"] }, true, false],
                        },
                        studentDetails: {
                            $filter: {
                                input: "$studentDetails",
                                as: "student",
                                cond: {
                                    $eq: ["$$student._id", new Types.ObjectId(studentId)]
                                }
                            }
                        }
                    }
                }
            ]))[0];
            if (existStudent?.exist) {
                throw new Error("Student is already assigned to this batch");
            }

            const isEnrolled: IEnrollment | null = await enrollmentModel.findOne({
                studentId: studentId,
                batchId: batchId,
                status: 'active'
            });
            if(!isEnrolled) {
                throw new Error("Student is not enrolled in this batch");
            }

            batch.students.push(new Types.ObjectId(studentId));
            const updatedBatch: IBatch = await batch.save();
            return updatedBatch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async removeStudentFromBatch(studentId: string, batchId: string): Promise<IBatch> {
        try {
            const studentRole: IRole | null = await roleRepositories.getRoleByRole('student')!;
            if (!studentRole) {
                throw new Error('Cannot find teacher role');
            }
            const [batch, student] = await Promise.all([
                batchModel.findById(batchId),
                userModel.findOne({ _id: studentId, role: studentRole._id })
            ]);

            if (!batch) {
                throw new Error('Course not found');
            }

            if (!student) {
                throw new Error('Teacher not found');
            }

            const newStudentList = batch.students.filter((id) => id.toString() !== studentId);
            if (newStudentList.length == batch.students.length) {
                throw new Error('Student is not assign to this batch');
            } else {
                batch.students = newStudentList;
            }

            const updatedBatch: IBatch = await batch.save();
            return updatedBatch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateBatch(id: string, body: Partial<IBatch>): Promise<IBatch | null> {
        try {
            const updatedBatch: IBatch | null = await batchModel.findByIdAndUpdate(id, body, { new: true });
            return updatedBatch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteBatch(id: string): Promise<IBatch | null> {
        try {
            const deletedBatch: IBatch | null = await batchModel.findByIdAndUpdate(id, { isActive: false });
            return deletedBatch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllBatches(courseId: string): Promise<IBatch[]> {
        try {
            const course: ICourse | null = await courseModel.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            const [batches] = await batchModel.aggregate([
                {
                    $match: { courseId: new Types.ObjectId(courseId), isActive: true },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'teacherId',
                        foreignField: '_id',
                        as: 'teacher'
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "students",
                        foreignField: "_id",
                        as: "studentDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        course: {
                            $arrayElemAt: ["$course", 0]
                        },
                        teacher: {
                            $arrayElemAt: ["$teacher", 0]
                        },
                        totalStudents: { $size: '$students' },
                        studentDetails: {
                            _id: 1,
                            image: 1,
                            email: 1
                        },
                        startDate: 1,
                        endDate: 1
                    }
                },
                {
                    $group: {
                        _id: null, // Group all batches together
                        batches: { $push: "$$ROOT" }, // Collect all batch documents
                        batchCount: { $sum: 1 } // Count the total number of batches
                    }
                },
                {
                    $project: {
                        _id: 0,
                        batches: 1,
                        batchCount: 1
                    }
                }
            ]);

            return batches;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getBatchById(batchId: string): Promise<any | null> {
        try {
            // const batch: IBatch | null = await batchModel.findById(id).populate('courseId', 'teacherId', 'students');
            const batch: IBatch | null = (await batchModel.aggregate([
                {
                    $match: {_id: new Types.ObjectId(batchId)}
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'teacherId',
                        foreignField: '_id',
                        as: 'teacher'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField:'students',
                        foreignField: '_id',
                        as:'studentDetails'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        course: {
                            $arrayElemAt: ["$course", 0]
                        },
                        // teacher: {
                        //     $arrayElemAt: ["$teacher", 0]
                        // },
                        teacher: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: "$teacher",
                                        as: "teacherDoc",
                                        in: {
                                            _id: "$$teacherDoc._id",
                                            image: "$$teacherDoc.image",
                                            email: "$$teacherDoc.email"
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        totalStudents: { $size: '$students' },
                        studentDetails: {
                            _id: 1,
                            image: 1,
                            email: 1
                        },
                        startDate: 1,
                        endDate: 1
                    }
                }
            ]))[0];
            return batch;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new batchRepository();