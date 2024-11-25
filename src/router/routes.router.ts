import express from 'express'
import { register, login, logout } from '../controllers/userLogin.controller';
import { updateUserById, deleteUser } from '../controllers/crud.controller';
import passport from 'passport';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);

router.route('/:id').put(updateUserById);
router.route('/:id').delete(deleteUser);

export default router;

// passport.authenticate("local", { failureRedirect: "/register" })