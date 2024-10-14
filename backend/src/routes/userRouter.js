import { Router } from "express";
import { deleteUser, getAllUser, updateUser } from "../controller/userController.js";
import verifyToken from "../utils/verif_Token.js";
import { upload } from "../utils/image_handler.js";
const userRoute = Router()

userRoute.get('/getUser',verifyToken, getAllUser)
userRoute.put('/updateUser',upload.single('profile_image'),verifyToken,updateUser)
userRoute.delete('/deleteUser',verifyToken, deleteUser)

export default userRoute;