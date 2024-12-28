import { Router } from "express";
import userRouter from "./api/user.routes";

const router = Router();

router.use("/api/user", userRouter)

export default router;