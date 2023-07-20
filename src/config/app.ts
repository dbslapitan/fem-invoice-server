import * as express from 'express';

const app = express();

app.get('/', (req, res, next) => { res.json({"message": "Successful"}) })

module.exports = app;