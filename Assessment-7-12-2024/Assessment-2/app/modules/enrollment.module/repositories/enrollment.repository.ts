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
                batchModel.findById(body.batchId),
                courseModel.findById(body.courseId),
                userModel.findOne({ _id: body.studentId, role: studentRole._id })
            ]);
            if (!batch) throw new Error('Course not found');
            if (!course) throw new Error('Batch not found');
            if (!student) throw new Error('Teacher not found');

            // Check if already enrolled
            const existingEnrollment = await enrollmentModel.findOne({
                student: body.studentId,
                course: body.courseId,
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