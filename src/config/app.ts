import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {customErrorHandler} from "./error-handler";

const invoicesRouter = require('../routes/invoices-routes');

export const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/invoices', invoicesRouter);

app.use(customErrorHandler);