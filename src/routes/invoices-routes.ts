import * as express from "express";
import * as invoicesController from "../controllers/invoices-controller";

const router = express.Router();

router.route('/').get(invoicesController.getInvoices);

router.route('/:stringId').get(invoicesController.getFullInvoice);

router.route('/:stringId').put(invoicesController.putFullInvoice);

module.exports = router;