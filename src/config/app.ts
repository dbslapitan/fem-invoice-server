import * as express from 'express';

const app = express();

const invoicesRouter = require('../routes/invoices-routes');

app.use('/api/v1/invoices', invoicesRouter);

module.exports = app;