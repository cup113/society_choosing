import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import 'express-async-errors';

import indexRouter from './routes/choose.mjs';
import societiesRouter from './routes/societies.mjs';
import loginRouter from './routes/login.mjs';
import chooseRouter from './routes/choose.mjs';
import exportRouter from './routes/export.mjs';

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api/societies', societiesRouter);
app.use('/api/login', loginRouter);
app.use('/api/choose', chooseRouter);
app.use('/api/export', exportRouter);

export default app;
