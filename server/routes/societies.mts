import express from 'express';
import get_pb from '../src/database.mjs';
const router = express.Router();

router.get('/list', async function (req, res, next) {
    res.json(await get_pb().collection('societies').getFullList({
        sort: '-created'
    }));
});

export default router;
