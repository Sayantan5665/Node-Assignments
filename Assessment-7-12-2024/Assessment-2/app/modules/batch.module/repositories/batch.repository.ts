import { Types } from 'mongoose';
import { batchModel, batchValidator } from '../models/batch.model';
import { IBatch, ICourse, IRole } from '@interfaces';
import courseModel from 'app/modules/course.module/models/course.model';
import userModel from 'app/modules/user.module/models/user.model';
import roleRepositories from 'app/modules/role.module/repositories/role.repositories';


class batchRepository {
    async addBatch(body: IBatch): Promise<IBatch> {
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

            batch.students = batch.students.filter((id) => id.toString() !== studentId);
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
            
            const batches: IBatch[] = await batchModel.aggregate([
                {
                    $match: { courseId: new Types.ObjectId(courseId) },
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
                    $project: {
                        _id: 1,
                        name: 1,
                        course: 1,
                        teacher: 1,
                        totalStudents: { $size: '$students' },
                        startDate: 1,
                        endDate: 1
                    }
                }
            ])
            return batches;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new batchRepository();