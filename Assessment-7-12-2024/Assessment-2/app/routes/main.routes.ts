import { Router } from "express";
import userRouter from "./api/user.routes";
import roleRouter from "./api/role.routes";
import courseRouter from "./api/course.routes";
import batchRouter from "./api/batch.routes";

const router = Router();

router.use("/api/user", userRouter);
router.use("/api/user/role", roleRouter);
router.use("/api/course", courseRouter);
router.use("/api/batch", courseRouter);

export default router;