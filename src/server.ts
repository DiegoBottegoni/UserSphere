import express from 'express';
import authRoutes from './features/auth/authRoutes';
import userRoutes from './features/users/userRoutes';
import friendshipRoutes from './features/friendships/friendshipRoutes';
import dotenv from 'dotenv';
import { errorHandler } from './infrastructure/middleware/errorHandler';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/friendships', friendshipRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 4000;

app.get('/', (_req, res) => {
  res.send('Hello to UserSphere user management API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
