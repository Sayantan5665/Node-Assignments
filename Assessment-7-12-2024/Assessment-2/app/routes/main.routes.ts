import { Router } from "express";
import userRouter from "./api/user.routes";
import roleRouter from "./api/role.routes";
import courseRouter from "./api/course.routes";
import batchRouter from "./api/batch.routes";
import enrollRouter from "./api/enrollment.routes";
import attendanceRouter from "./api/attendance.routes";
import examRouter from "./api/exam.routes";

const router = Router();

router.use("/api/user", userRouter);
router.use("/api/user/role", roleRouter);
router.use("/api/course", courseRouter);
router.use("/api/batch", batchRouter);
router.use("/api/enrollment", enrollRouter);
router.use("/api/attendance", attendanceRouter);
router.use("/api/exam", examRouter);

export default router;