import dotenv from 'dotenv'
import express from 'express';
import userRouter from './router/routes.router';
import categoryRouter from './router/category.router';
import connectDB from './db/connect.db';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from 'express-session';
import { initializingPassport } from './passports/passport';

const app = express();
dotenv.config()

initializingPassport(passport);

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/category', categoryRouter);

const start = async () => {
  await connectDB(process.env.MONGO_URL as string);
  console.log('DB Connected');
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}

start()