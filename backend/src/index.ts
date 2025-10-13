import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from "cors"
import dotenv from 'dotenv';
import projectRouter from './routers/project';
import taskRouter from './routers/task';
import listRouter from './routers/list';
import userRouter from './routers/user';


// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

// A simple GET route to confirm the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript Server!');
});

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));


// Routes
app.use('/api/project', projectRouter);
app.use('/api/task', taskRouter);
app.use('/api/list', listRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});