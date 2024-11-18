// Here's a detailed guide to creating a CRUD application with authentication, cookies, and session management in Node.js
// using TypeScript and MongoDB. We'll use popular packages like express, mongoose, express-session, and cookie-parser.

// 1. Initialize the Project
// Run the following commands to initialize the project and install dependencies:

// bash
// Copy code
// mkdir node-ts-mongodb-crud
// cd node-ts-mongodb-crud
// npm init -y
// npm install express mongoose express-session cookie-parser bcryptjs jsonwebtoken
// npm install --save-dev typescript @types/node @types/express @types/cookie-parser @types/express-session ts-node-dev
// npx tsc --init
// 2. Configure TypeScript
// Update tsconfig.json with the following:

// json
// Copy code
// {
// "compilerOptions": {
// "target": "ES6",
// "module": "commonjs",
// "outDir": "./dist",
// "rootDir": "./src",
// "strict": true,
// "esModuleInterop": true
// },
// "include": ["src"]
// }
// 3. Project Structure
// Create the following directory structure:

// lua
// Copy code
// node-ts-mongodb-crud
// ├── src
// │ ├── config
// │ │ └── db.ts
// │ ├── middleware
// │ │ └── auth.ts
// │ ├── models
// │ │ └── User.ts
// │ ├── routes
// │ │ └── userRoutes.ts
// │ ├── app.ts
// │ └── server.ts
// ├── package.json
// ├── tsconfig.json
// 4. Database Configuration
// Create src/config/db.ts:

// typescript
// Copy code
// import mongoose from "mongoose";

// const connectDB = async () => {
// try {
// await mongoose.connect("mongodb://127.0.0.1:27017/node_ts_crud", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// });
// console.log("MongoDB connected");
// } catch (error) {
// console.error("Error connecting to MongoDB:", error);
// process.exit(1);
// }
// };

// export default connectDB;
// 5. Define User Model
// Create src/models/User.ts:

// typescript
// Copy code
// import mongoose, { Document, Schema } from "mongoose";

// export interface IUser extends Document {
// username: string;
// email: string;
// password: string;
// }

// const UserSchema: Schema = new Schema(
// {
// username: { type: String, required: true, unique: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// },
// { timestamps: true }
// );

// export default mongoose.model<IUser>("User", UserSchema);
//   6. Authentication Middleware
//   Create src/middleware/auth.ts:

//   typescript
//   Copy code
//   import { Request, Response, NextFunction } from "express";
//   import jwt from "jsonwebtoken";

//   export const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//   const decoded = jwt.verify(token, "your_jwt_secret_key");
//   req.body.user = decoded;
//   next();
//   } catch (error) {
//   res.status(401).json({ message: "Invalid token" });
//   }
//   };
//   7. Routes
//   Create src/routes/userRoutes.ts:

//   typescript
//   Copy code
//   import express from "express";
//   import User, { IUser } from "../models/User";
//   import bcrypt from "bcryptjs";
//   import jwt from "jsonwebtoken";
//   import { authenticate } from "../middleware/auth";

//   const router = express.Router();

//   // Register
//   router.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ username, email, password: hashedPassword });
//   res.status(201).json(user);
//   } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
//   });

//   // Login
//   router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id, email: user.email }, "your_jwt_secret_key", { expiresIn: "1h" });
//   res.cookie("token", token, { httpOnly: true }).status(200).json({ message: "Logged in" });
//   } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
//   });

//   // Logout
//   router.post("/logout", (req, res) => {
//   res.clearCookie("token").status(200).json({ message: "Logged out" });
//   });

//   // Protected Route
//   router.get("/profile", authenticate, async (req, res) => {
//   try {
//   const user = await User.findById(req.body.user.id);
//   res.status(200).json(user);
//   } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
//   });

//   // CRUD Operations
//   router.put("/update", authenticate, async (req, res) => {
//   const { username, email } = req.body;
//   try {
//   const user = await User.findByIdAndUpdate(req.body.user.id, { username, email }, { new: true });
//   res.status(200).json(user);
//   } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
//   });

//   router.delete("/delete", authenticate, async (req, res) => {
//   try {
//   await User.findByIdAndDelete(req.body.user.id);
//   res.status(200).json({ message: "Account deleted" });
//   } catch (error) {
//   res.status(400).json({ error: error.message });
//   }
//   });

//   export default router;
//   8. Main Application
//   Create src/app.ts:

//   typescript
//   Copy code
//   import express from "express";
//   import cookieParser from "cookie-parser";
//   import session from "express-session";
//   import userRoutes from "./routes/userRoutes";
//   import connectDB from "./config/db";

//   const app = express();

//   // Connect to MongoDB
//   connectDB();

//   // Middleware
//   app.use(express.json());
//   app.use(cookieParser());
//   app.use(
//   session({
//   secret: "your_session_secret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }, // Use `true` if using HTTPS
//   })
//   );

//   // Routes
//   app.use("/api/users", userRoutes);

//   export default app;
//   9. Server Setup
//   Create src/server.ts:

//   typescript
//   Copy code
//   import app from "./app";

//   const PORT = process.env.PORT || 5000;

//   app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   });
//   10. Run the Application
//   Add the following scripts to package.json:

//   json
//   Copy code
//   "scripts": {
//   "start": "node dist/server.js",
//   "dev": "ts-node-dev src/server.ts"
//   }
//   Run the application:

//   bash
//   Copy code
//   npm run dev