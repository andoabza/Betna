import express from "express";
import connectDB from "./config/db.js";
import cors  from "cors";
import dotenv  from "dotenv";
import morgan  from "morgan";
import helmet  from "helmet";
import rateLimit  from "express-rate-limit";
import xss  from "xss-clean";
import hpp  from "hpp";
import compression  from "compression";

const app =  express();
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(xss());
app.use(hpp());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// Routes
import houseRoutes  from './routes/houseRoutes.js';
import userRoutes  from './routes/userRoutes.js';
import { errorHandler } from "./controllers/houseController.js";
// import commentRoutes  from './routes/commentRoutes.js');
// import authRoutes  from './routes/authRoutes.js');
// import categoryRoutes  from './routes/categoryRoutes.js');
// import tagRoutes  from './routes/tagRoutes.js');
// import adminRoutes  from './routes/adminRoutes.js');
// import searchRoutes  from './routes/searchRoutes.js');
// import contactRoutes  from './routes/contactRoutes.js');
// import newsletterRoutes  from './routes/newsletterRoutes.js');
// import likeRoutes  from './routes/likeRoutes.js');
app.use(errorHandler);
app.use("/api/v1/houses", houseRoutes);
app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/comments", commentRoutes);
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/v1/tags", tagRoutes);
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/search", searchRoutes);
// app.use("/api/v1/contact", contactRoutes);
// app.use("/api/v1/newsletter", newsletterRoutes);
// app.use("/api/v1/likes", likeRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(403).send("Unauthorized!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
