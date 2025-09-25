import { Router } from 'express';
import { register, login } from './authController';
import { authenticate } from './authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Ruta protegida de prueba
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'Token válido', user: (req as any).user });
});

export default router;
