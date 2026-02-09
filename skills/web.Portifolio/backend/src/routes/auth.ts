import { Router } from 'express';
import { login, register, refresh, logout, verify2FA } from '../controllers/authController';

const router: Router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-2fa', verify2FA);

export default router;
