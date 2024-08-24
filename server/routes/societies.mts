import express from 'express';
import get_pb from '../src/database.mjs';
import { get_time_status } from '../src/time.mjs';
const router = express.Router();

router.get('/list', async function (req, res, next) {
    res.json({
        societies: await get_pb().collection('societies').getFullList({
            sort: '-created'
        }),
        timeStatus: get_time_status(),
    });
});

export default router;
