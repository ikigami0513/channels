import * as express from 'express';
import { upload } from '../config';

// Middlewares
import { apiAuthMiddleware } from '../middlewares/apiAuth';

// Controllers
import { loginController } from "../controllers/login.controller";
import { registerController } from '../controllers/register.controller';
import { getUser, changeUserProfilePicture } from '../controllers/user.controller';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/user', apiAuthMiddleware, getUser);
router.post('/user/change_profile_picture', apiAuthMiddleware, upload.single('file'), changeUserProfilePicture);

export default router;