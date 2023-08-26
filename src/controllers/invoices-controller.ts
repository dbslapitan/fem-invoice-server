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

        const newInvoice: any = {...invoice};
        newInvoice["clientAddress"] = addresses.find(address => address.attachedTo === "clientAddress");
        newInvoice["senderAddress"] = addresses.find(address => address.attachedTo === "senderAddress");
        res.status(200).json({newInvoice, items});
    }catch (error){
        const stringId = req.params.stringId;
        logger.error(`Error while getting invoice ${stringId}...`, error)
        next(error);
    }
}

export async function putFullInvoice(req, res, next) {
    try {
        const stringId = req.params.stringId;
        const {invoice, items, addresses} = req.body;

        const addressRepository = postgresDataSource.getRepository(Address);

        await postgresDataSource
            .getRepository(Invoice)
            .createQueryBuilder()
            .update(Invoice)
            .set(invoice)
            .where("stringId = :stringId", {stringId})
            .execute();

        const invoiceRepository = await postgresDataSource
            .getRepository(Invoice)
            .findOneBy({stringId});

        for(let item of items){
            if(!item.id){
                const {id, ...restOfItem} = item;
                const newItem = {...restOfItem} as Partial<Item>;
                newItem.invoice = invoiceRepository;
                const itemRepository = postgresDataSource
                    .getRepository(Item);
                const newItemRepo = itemRepository.create(newItem);
                await itemRepository.save(newItemRepo);
            }
        }

        /*
        for(let item of items){
            if(!item.id){
                const {id, ...newItem} = item;
                newItem.invoice = invoiceRepository;
            }
            await postgresDataSource
                .getRepository(Item)
                .createQueryBuilder()
                .update(Item)
                .set(item)
                .where("id = :id", {id: item.id})
                .execute();
        }*/

        return res.status(200).json({
            success: true,
            message: `Invoice ${stringId} successfully updated`
        });
    } catch (error) {
        const stringId = req.params.stringId;
        logger.error(`Error while getting invoice ${stringId}...`, error)
        next(error);
    }
}