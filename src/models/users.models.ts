import mongoose from "mongoose";

interface IUser {
  username: string,
  email: string,
  password: string,
  referrerId: string

}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  referrerId: {
    type: String,
    required: true,
    unique: true
  }
})

const User = mongoose.model('User', userSchema);

export default User;