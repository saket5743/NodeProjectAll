import express from 'express'
import { register, login, logout } from '../controllers/userLogin.controller';
import { updateUserById, deleteUser } from '../controllers/crud.controller';
const router = express.Router();

// userLoginController
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);

// crudController
router.route('/:id').put(updateUserById);
router.route('/:id').delete(deleteUser);

export default router;
