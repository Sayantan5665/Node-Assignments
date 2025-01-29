import { Router } from "express";
import userRouter from "./api/user.routes";
import roleRouter from "./api/role.routes";
import categoryRouter from "./api/category.routes";
import labelRouter from "./api/label.routes";
import taskRouter from "./api/task.routes";

const router = Router();

router.use("/api/user", userRouter);
router.use("/api/user/role", roleRouter);
router.use("/api/category", categoryRouter);
router.use("/api/label", labelRouter);
router.use("/api/task", taskRouter);

export default router;