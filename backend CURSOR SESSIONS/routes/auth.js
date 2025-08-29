import express from "express";
import passport from "passport";
import "../config/passport.js";

import dotenv from 'dotenv'
dotenv.config()
const router = express.Router();
const frontend_url = process.env.FRONTEND_URL
// OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile","email"] }), 
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${frontend_url}` }),
  (req, res) => {
    res.redirect(`${frontend_url}/post-login`);
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router; 