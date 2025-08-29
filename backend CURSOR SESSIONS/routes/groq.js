// routes/groq.route.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/groq", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      answer: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in /api/groq:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});



export default router;
