import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import connectDB from './configs/connectDB.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Connect to Cloudinary
await connectCloudinary();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('🚀 Server is Live'));

app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
