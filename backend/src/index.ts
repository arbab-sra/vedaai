import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignment.routes';
import { initQueueWorkers } from './services/queue.service';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import profileRoutes from './routes/profile.routes';

app.use('/api/assignments', assignmentRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5001;

// Start server for local development
const start = async () => {
  try {
    await connectDB();
    await initQueueWorkers();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  start();
} else {
  // For Vercel Serverless Functions
  connectDB().catch(console.error);
}

export default app;
