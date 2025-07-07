// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


import emailRouter from './api/send-email.js'; // router file


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', emailRouter); // /api/send-email

app.listen(3001, () => {
  console.log('Backend running at http://localhost:3001');
});
