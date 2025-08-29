import { v4 as uuidv4 } from "uuid"; 
import express from "express";
import Flow from '../models/flow.model.js'; 
import {ensureAuth} from '../middleware/auth.js'

const router = express.Router()

// The first time the chat is created 
// and the redirection to the flow is done 

router.post("/createFlow", ensureAuth,  async (req, res) => {
  const { question, answer } = req.body;
// posted to by post Login page to create a new flow
  try {
    const newNode = {
      id: uuidv4(),
      type: "customNode",
      data: {
        question,
        answer,
      },
      position: {
        x: 0,
        y: 0,
      },
    };

    const newFlow = await Flow.create({
      userId: req.user._id, // Use authenticated user's ID from session
      nodes: [newNode],
      edges: [],
    });

    res.status(201).json({ flowId: newFlow._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

router.get("/fetchFlow/:flowId", ensureAuth, async(req,res)=>{
    try{
      const flow = await Flow.findById(req.params.flowId); 
      if(!flow) return res.status(404).json({error: 'flow not found'}); 
      res.json(flow); 
    }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
}); 

router.put("/updateFlow/:flowId", ensureAuth, async (req, res) => {
  const { flowId } = req.params;
  const { nodes, edges } = req.body;
  
  try {
    const updatedFlow = await Flow.findOneAndUpdate(
      { _id: flowId, userId: req.user._id },
      { $set: { nodes, edges } },
      { new: true }
    );
    
    if (!updatedFlow) {
      return res.status(404).json({ error: "Flow not found" });
    }
    
    res.json(updatedFlow);
  } catch (error) {
    console.error("Error updating flow:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// routes/flow.js
router.get("/fetchAllFlows", ensureAuth, async (req, res) => {
  try {
    const flows = await Flow.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .lean(); // returns plain JS objects, easier to modify

    // Attach title from first node’s question
    const enrichedFlows = flows.map(flow => ({
      ...flow,
      title: flow.nodes?.[0]?.data?.question || "Untitled Chat",
    }));

    res.json(enrichedFlows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /flow/:flowId
router.delete("/deleteFlow/:flowId", ensureAuth, async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.flowId);

    if (!flow) {
      return res.status(404).json({ error: "Flow not found" });
    }

    // Make sure the logged-in user owns this flow
    if (flow.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Flow.findByIdAndDelete(req.params.flowId);

    res.json({ message: "Flow deleted successfully", flowId: req.params.flowId });
  } catch (err) {
    console.error("Error deleting flow:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});











// Proxy route for Groq API
router.post("/groq-proxy", ensureAuth, async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    
    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    
    // Get Groq API key from environment variables
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key not configured on server" });
    }
    
    // Make request to Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "llama-3.1-8b-instant",
        messages: messages,
        temperature: temperature !== undefined ? temperature : 0.7,
        max_tokens: max_tokens || 1024,
      }),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }
    
    // Return the response from Groq API
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Groq proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;