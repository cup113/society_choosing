import express from 'express';
import get_pb from '../src/database.mjs';
import logger from '../src/logger.mjs';
const router = express.Router();

router.post('/', async function (req, res) {
  logger.info(`Received choose request from ${req.ip}: ${JSON.stringify(req.body)}`);
  const { token, user, first_choice, second_choice, adjust_prior } = req.body;
  const pb = get_pb();
  pb.authStore.save(token);
  if (!pb.authStore.isValid) {
    throw new Error(`Invalid token: ${token}`);
  }
  pb.collection('users').authRefresh();

  const data = {
    user,
    first_choice,
    second_choice,
    adjust_prior,
  };
  try {
    const dbRes = await pb.collection('choosing_24B').create(data);
    res.json(dbRes);
  } catch (err) {
    logger.error(`Unauthorized to choose societies: ${err}`);
    res.status(401).json({ error: err });
  }
});

export default router;
