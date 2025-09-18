import express from"express"
import { getAllUsers, login, logout, register, updateProfile } from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.put("/profile/update",isAuthenticated,singleUpload, updateProfile);
router.route("/all-users").get(getAllUsers)


export default router