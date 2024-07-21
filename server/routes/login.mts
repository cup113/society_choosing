import express from 'express';
import get_pb from '../src/database.mjs';
import logger from '../src/logger.mjs';
const router = express.Router();

router.post('/', async function (req, res) {
  logger.info(`Received login request from ${req.ip}: username=${req.body.username}`)
  const { username, password } = req.body;

  const pb = get_pb();
  const auth = await pb.collection('users').authWithPassword(username, password);
  await pb.collection('users').authRefresh();

  // TODO also return user data
  res.json({ success: true, userID: auth.record.id, token: auth.token });
});

export default router;
