import {postgresDataSource} from "../config/data-source";
import {Invoice} from "../models/invoice.model";
import {logger} from "../config/logger";
import {Address} from "../models/address.model";
import {Item} from "../models/item.model";

export async function getInvoices(req, res, next) {
    try {
        const invoices = await postgresDataSource.getRepository(Item)
            .createQueryBuilder("invoices").getMany();

        res.status(200).json(invoices);
    }catch (error){
        logger.error("Error while getting Invoices...", error)
        next(error);
    }
}