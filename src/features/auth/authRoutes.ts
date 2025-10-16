import { Router } from 'express';
import { register, login, logout } from './authController';
import { authenticate } from './authMiddleware';
import { authMiddleware } from '../../infrastructure/middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);


// Ruta protegida de prueba
router.get('/me', authMiddleware, authenticate, (req, res) => {
  res.json({
    message: 'Authenticated user',
    user: req.user,
  });
});


export default router;
