import { Router } from 'express';
import { Message } from '../models/Message.js';

const router = Router();

// GET /api/messages - chat history (latest 100)
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/messages - save and broadcast
router.post('/', async (req, res, next) => {
  try {
    const { username, text } = req.body;
    if (!username || !username.trim() || !text || !text.trim()) {
      return res.status(400).json({ error: 'username and text are required' });
    }
    const message = await Message.create({
      username: username.trim(),
      text: text.trim(),
    });
    req.io.emit('message:new', message);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

 export default router;