import express from 'express';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5174' // Allow frontend dev server
}));

app.use(express.json());
app.use('/products', productRoutes);

app.all('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;