import express from 'express';
import get_pb from '../src/database.mjs';
import logger from '../src/logger.mjs';
import { auth } from '../src/authorization.mjs';
const router = express.Router();

router.get('/', async function (req, res) {
  logger.info(`Received history request from ${req.ip}`);
  const pb = get_pb();
  const authResult = await auth(req, pb);
  if (!authResult.success) {
    logger.error(`Unauthorized to get history: ${authResult.error}`);
    res.status(authResult.code).json({ error: authResult.error });
    return;
}

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
