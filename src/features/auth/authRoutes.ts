import { Router } from 'express';
import { register, login, logout } from './authController';
import { verifyUserSession } from '../../infrastructure/middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyUserSession, logout);


// Ruta protegida de prueba
router.get('/me', verifyUserSession, (req, res) => {
  res.json({
    message: 'Authenticated user',
    user: req.user,
  });
});


export default router;
