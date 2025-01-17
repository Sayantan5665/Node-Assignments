import { Router } from "express";
import userRouter from "./api/user.routes";
import roleRouter from "./api/role.routes";
import bookingRouter from "./api/booking.routes";
import movieRouter from "./api/booking.routes";
import theatreRouter from "./api/booking.routes";

const router = Router();

router.use("/api/user", userRouter);
router.use("/api/user/role", roleRouter);
router.use("/api/booking", bookingRouter);
router.use("/api/theatre", theatreRouter);

export default router;