import express from 'express';
import type { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// For environment variable configuration
dotenv.config();

const app: Express = express();
// It's good practice to use an environment variable for the port with a fallback
const port = process.env.PORT || 3002;

// A simple GET route to confirm the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript Server!');
});

// Start the server
app.listen(port, () => {
  // A console log to confirm the server is running and on which port
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});