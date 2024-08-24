import express from 'express';
import get_pb from '../src/database.mjs';
import logger from '../src/logger.mjs';
const router = express.Router();

router.post('/', async function (req, res) {
  logger.info(`Received history request from ${req.ip}: ${JSON.stringify(req.body)}`);
  const { token } = req.body;
  const pb = get_pb();
  pb.authStore.save(token);
  if (!pb.authStore.isValid) {
    throw new Error(`Invalid token: ${token}`);
  }
  await pb.collection('users').authRefresh();

  try {
    const result = await pb.collection('choosing_24B').getList(1, 5, {
      sort: '-created'
    });
    res.json(result);
  } catch (err) {
    logger.error(`Unauthorized to get history: ${err}`);
    res.status(401).json({ error: err });
  }
});

export default router;
