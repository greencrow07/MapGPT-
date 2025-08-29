import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

// Import configurations
import connectDB from "./config/database.js";
import sessionConfig from "./config/session.js";
import "./config/passport.js";

// Import routes
import authRoutes from "./routes/auth.js";
import flowRoutes from "./routes/flow.js"


// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/flow", flowRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
}); 