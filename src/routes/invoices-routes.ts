import * as express from "express";
import * as invoicesController from "../controllers/invoices-controller";

const router = express.Router();

router.route('/').get(invoicesController.getInvoices);

module.exports = router;