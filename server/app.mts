import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import compression from 'compression';
import 'express-async-errors';

import indexRouter from './routes/choose.mjs';
import societiesRouter from './routes/societies.mjs';
import loginRouter from './routes/login.mjs';
import chooseRouter from './routes/choose.mjs';
import historyRouter from './routes/history.mjs';
import exportRouter from './routes/export.mjs';

var app = express();

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
app.use(compression());

app.use('/', indexRouter);
app.use('/api/societies', societiesRouter);
app.use('/api/login', loginRouter);
app.use('/api/choose', chooseRouter);
app.use('/api/history', historyRouter);
app.use('/api/export', exportRouter);

export default app;
