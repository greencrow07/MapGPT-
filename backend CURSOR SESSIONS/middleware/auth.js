import dotenv from 'dotenv'
import Flow from '../models/flow.model.js'
dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL; 



export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" }).redirect(`${FRONTEND_URL}/login`);
};


  

export const ensureFlowOwnership = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const flow = await Flow.findById(chatId);
    if (!flow) {
      return res.status(404).json({ error: 'Flow not found' });
    }

    if (flow.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: Not your flow' });
    }

    // Attach flow to request object for further use if needed
    req.flow = flow;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};