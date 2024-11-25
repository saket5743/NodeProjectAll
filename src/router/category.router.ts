import express from 'express';
import { categoryAll, categoryById, categoryDelete, categoryUpdate, createCategory } from '../controllers/category.controller';

const router = express.Router();


router.route('/categoryAll').get(categoryAll);
router.route('/createCategory').post(createCategory);
router.route('/:id').get(categoryById).put(categoryUpdate).delete(categoryDelete);

export default router;