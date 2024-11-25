import mongoose, { model } from 'mongoose';

interface ICategory {
  name: string,
  description?: string
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
})

const Category = mongoose.model('Category', categorySchema);

export default Category;