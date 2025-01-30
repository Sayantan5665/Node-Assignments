import { courseModel, courseValidator } from "../models/course.model";
import { ICourse } from "@interfaces";

class courseRepository {
    async addCourse(body: ICourse): Promise<ICourse> {
        try {
            const { error } = courseValidator.validate(body);
            if (error) throw error;

            const data = new courseModel(body);
            const newCourse: ICourse = await data.save();
            return newCourse;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetch all available courses along with: (Admin only)
     ** Total batches for the course
     ** Total enrolled students 
    */
    async getAllCourses(): Promise<ICourse[]> {
        try {
            const courses: ICourse[] = await courseModel.aggregate([
                {
                    $match: {isActive: true },
                },
                {
                    $lookup: {
                        from: 'batches',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'batches'
                    }
                },
                {
                    $lookup: {
                        from: 'enrollments',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'enrollments'
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        duration: 1,
                        fees: 1,
                        totalBatches: { $size: '$batches' },
                        batches: 1,
                        totalEnrollments: { $size: '$enrollments' },
                        enrollments: 1
                    }
                }
            ]);
            return courses;
        } catch (error) {
            throw error;
        }
    }

    
    /**
     ** Admin only
     */
    async updateCourse(id: string, body: ICourse): Promise<ICourse | null> {
        try {
            body.isActive?.toString()?.length && delete body.isActive;
            const updatedCourse: ICourse | null = await courseModel.findByIdAndUpdate(id, body, { new: true });
            return updatedCourse ? updatedCourse : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     ** Admin only
     */
    async removeCourse(id: string): Promise<ICourse | null> {
        try {
            const updatedCourse: ICourse | null = await courseModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
            return updatedCourse ? updatedCourse : null;
        } catch (error) {
            throw error;
        }
    }
}

export default new courseRepository();