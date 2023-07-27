import {postgresDataSource} from "../config/data-source";
import {Invoice} from "../models/invoice.model";
import {logger} from "../config/logger";
import {Address} from "../models/address.model";
import {Item} from "../models/item.model";

export async function getInvoices(req, res, next) {
    try {
        const invoices = await postgresDataSource.getRepository(Invoice)
            .createQueryBuilder("invoices").orderBy("invoices.createdAt").getMany();

        res.status(200).json(invoices);
    }catch (error){
        logger.error("Error while getting Invoices...", error)
        next(error);
    }
}

export async function getFullInvoice(req, res, next){
    try {
        const stringId = req.params.stringId;
        logger.info(`Getting full invoice of ${stringId}`);

        if(!stringId){
            throw "Could not extract the stringId from the request parameters..."
        }

        const invoice = await postgresDataSource.getRepository(Invoice).findOneBy({stringId});
        const items = await postgresDataSource.getRepository(Item).findBy({invoice});
        const addresses = await postgresDataSource.getRepository(Address).findBy({invoice});

        res.status(200).json({invoice, items, addresses });
    }catch (error){
        const stringId = req.params.stringId;
        logger.error(`Error while getting invoice ${stringId}...`, error)
        next(error);
    }
}