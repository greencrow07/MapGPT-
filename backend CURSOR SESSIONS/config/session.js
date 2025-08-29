import session from "express-session";
import MongoStore from "connect-mongo";

const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/FLOWDB";

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

export default sessionConfig; 