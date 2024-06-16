import * as express from 'express';
import { loginController } from "../controllers/login";
import { registerController } from '../controllers/register';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);

export default router;