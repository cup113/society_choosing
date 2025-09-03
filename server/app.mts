import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import compression from 'compression';
import history from 'connect-history-api-fallback';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import societiesRouter from './routes/societies.mjs';
import loginRouter from './routes/login.mjs';
import chooseRouter from './routes/choose.mjs';
import reviewRouter from './routes/review.mjs';
import adminRouter from './routes/admin.mjs';
import altchaRouter from './routes/altcha.mjs';

var app = express();

logger.token('ip', (req) => req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress ?? '-');
logger.format('dev', ':method :url :status :response-time ms - :ip - :res[content-length]')
app.use(logger('dev'));
app.set('trust proxy', 1);
app.use(rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    limit: 200,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(timeout(30 * 1000));
app.use((req, res, next) => {
    if (!req.timedout) {
        next();
    }
});
app.use(compression());

app.use('/api/societies', societiesRouter);
app.use('/api/login', loginRouter);
app.use('/api/choose', chooseRouter);
app.use('/api/review', reviewRouter);
app.use('/api/admin', adminRouter);
app.use('/api/altcha', altchaRouter);
app.use(history());
app.use('/', express.static('./client/dist'))

export default app;
