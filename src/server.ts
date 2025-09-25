import express from 'express';
import authRoutes from './features/auth/authRoutes';
import userRoutes from './features/users/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);


const PORT = process.env.PORT || 4000;

app.get('/', (_req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
