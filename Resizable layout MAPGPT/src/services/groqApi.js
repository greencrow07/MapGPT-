import axios from "axios";

export async function sendToGroq(message) {
  try {
    // Wrap plain string into array if needed
    const messages = typeof message === "string"
      ? [{ role: "user", content: message }]
      : message;

    // Call your backend instead of Groq directly
    const response = await axios.post("/api/groq", { messages });

    return response.data.answer; // backend should send back { answer }
  } catch (error) {
    console.error("Error in sendToGroq (frontend):", error.response?.data || error.message);
    throw error;
  }
}
