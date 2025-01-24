import { Request, Response } from "express";
import courseRepository from "../../repositories/course.repository";
import { ICourse } from "@interfaces";

class courseController {
    async createCourse(req:Request, res:Response): Promise<any> {
        try {
            const newCourse: ICourse = await courseRepository.addCourse(req.body);
            return res.status(200).json({
                status: 200,
                message: 'Course added successfully',
                data: newCourse
            });
        } catch (error:any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    async fetchAllCourses(req:Request, res:Response): Promise<any> {
        try {
            const courses: ICourse[] = await courseRepository.getAllCourses();
            return res.status(200).json({
                status: 200,
                message: 'Courses fetched successfully',
                data: courses
            });
        } catch (error:any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    async updateCourse(req:Request, res:Response): Promise<any> {
        try {
            const courseId: string = req.params.id;
            const updatedCourse: ICourse | null = await courseRepository.updateCourse(courseId, req.body);
            if (!updatedCourse) {
                return res.status(200).json({
                    status: 400,
                    message: 'Course not found'
                });
            }
            return res.status(200).json({
                status: 200,
                message: 'Course updated successfully',
                data: updatedCourse
            });
        } catch (error:any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }

    async deleteCourse(req:Request, res:Response): Promise<any> {
        try {
            const courseId: string = req.params.id;
            await courseRepository.removeCourse(courseId);
            return res.status(200).json({
                status: 200,
                message: 'Course removed successfully'
            });
        } catch (error:any) {
            return res.status(500).json({
                status: 500,
                message: error.message || 'Something went wrong',
                error
            });
        }
    }
}

export default new courseController();