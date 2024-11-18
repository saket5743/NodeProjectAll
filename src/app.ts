import dotenv from 'dotenv'
import express from 'express';
import userRouter from './router/routes.router';
import connectDB from './db/connect.db';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config()

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);

const start = async () => {
  await connectDB(process.env.MONGO_URL as string);
  console.log('DB Connected');
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}

start()