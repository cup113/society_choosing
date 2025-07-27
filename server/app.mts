import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import compression from 'compression';
import logger_ from './services/logger.mjs';
import 'express-async-errors';

import societiesRouter from './routes/societies.mjs';
import loginRouter from './routes/login.mjs';
import chooseRouter from './routes/choose.mjs';
import historyRouter from './routes/history.mjs';
import exportRouter from './routes/export.mjs';
import reviewRouter from './routes/review.mjs';

var app = express();

logger.token('ip', (req) => req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress ?? '-');
logger.format('dev', ':method :url :status :response-time ms - :ip - :res[content-length]')
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(timeout(30 * 1000));
app.use((req, res, next) => {
    if (!req.timedout) {
        next();
    }
});
app.get("/", (req, res) => {
    res.redirect("/index.html");
});
app.use(compression());

app.use('/api/societies', societiesRouter);
app.use('/api/login', loginRouter);
app.use('/api/choose', chooseRouter);
app.use('/api/history', historyRouter);
app.use('/api/export', exportRouter);
app.use('/api/review', reviewRouter);
app.use('/', express.static('./client/dist'))

export default app;
