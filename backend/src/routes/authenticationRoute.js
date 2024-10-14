import { Router } from "express";
import { upload } from "../utils/image_handler.js";
import { authLoginRoute, authsignUpRoute } from "../controller/authenticationRoute.js";
const authRouter = Router();

authRouter.post('/signup',upload.single("user_image"), authsignUpRoute )
authRouter.post('/signin', authLoginRoute)

export default authRouter;