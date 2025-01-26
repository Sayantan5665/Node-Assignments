import roleRepositories from "app/modules/role.module/repositories/role.repositories";
import { enrollmentModel, enrollmentValidator } from "../models/enrollment.model";
import { IEnrollment, IRole } from "@interfaces";
import batchModel from "app/modules/batch.module/models/batch.model";
import courseModel from "app/modules/course.module/models/course.model";
import userModel from "app/modules/user.module/models/user.model";

class enrollmentRepository {
    async enrollStudent(body: IEnrollment): Promise<IEnrollment> {
        try {
            const studentRole: IRole | null = await roleRepositories.getRoleByRole('student')!;
            if (!studentRole) {
                throw new Error('Cannot find student role');
            }
            const [batch, course, student] = await Promise.all([
                batchModel.findOne({ _id: body.batchId, isActive: true }),
                courseModel.findOne({ _id: body.courseId, isActive: true }),
                userModel.findOne({ _id: body.studentId, role: studentRole._id })
            ]);
            if (!batch) throw new Error('Course not found');
            if (!course) throw new Error('Batch not found');
            if (!student) throw new Error('Teacher not found');

            // check if the courseId in the batch is same as the provided coursesId
            if(batch.courseId.toString() != body.courseId.toString()) {
                throw new Error('This batch is not in this course');
            }

            // Check if already enrolled
            const existingEnrollment:IEnrollment|null = await enrollmentModel.findOne({
                studentId: body.studentId,
                courseId: body.courseId,
                batchId: body.batchId,
                status: 'active'
            });

            if (existingEnrollment) {
                throw new Error('Student already enrolled in this course');
            }

            const { error } = enrollmentValidator.validate(body);
            if (error) throw error;

            const data = new enrollmentModel(body);
            const newEnrollment: IEnrollment = await data.save();
            return newEnrollment;
        } catch (error: any) {
            throw new Error(error.message || 'Something went wrong while enrolling student!');
        }
    }

}

export default new enrollmentRepository();