import session from "express-session";
import dotenv from 'dotenv'
import { BOOL_FALSE, BOOL_TRUE } from './constants'

dotenv.config()

export const sessionMiddleware = session({
  secret: process.env.SECRET_SESSION || 'default_secret',
  resave: BOOL_FALSE,
  saveUninitialized: BOOL_TRUE,
  cookie: { secure: BOOL_FALSE }
})