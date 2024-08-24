import express from 'express';
import get_pb from '../src/database.mjs';
import { auth } from '../src/authorization.mjs';
import logger from '../src/logger.mjs';
const router = express.Router();

router.post('/', async function (req, res) {
  logger.info(`Received choose request from ${req.ip}: ${JSON.stringify(req.body)}`);

  const { first_choice, second_choice, third_choice } = req.body;
  const pb = get_pb();
  const authResult = await auth(req, pb);
  if (!authResult.success) {
    logger.error(`Unauthorized to choose societies: ${authResult.error}`);
    res.status(401).json({ error: authResult.error });
    return;
  }

  const authData = authResult.authData;
  const user = authData.record.id;

  const data = {
    user,
    ip: req.ip,
    first_choice,
    second_choice,
    third_choice,
  };
  try {
    await pb.collection('choosing_24B').create(data);
    res.json({ success: true });
  } catch (err) {
    logger.error(`Unauthorized to choose societies: ${err}`);
    res.status(401).json({ error: err });
  }
});

export default router;
