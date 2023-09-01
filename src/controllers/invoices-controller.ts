import {postgresDataSource} from "../config/data-source";
import {Invoice} from "../models/invoice.model";
import {logger} from "../config/logger";
import {Address} from "../models/address.model";
import {Item} from "../models/item.model";
import {add} from "winston";

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

        const withRelations = await postgresDataSource
            .getRepository(Invoice)
            .findOne({
                relations: {
                    addresses: true,
                    items: true
                },
                where: {
                    stringId
                }
            });

        const invoice = await postgresDataSource.getRepository(Invoice).findOneBy({stringId});
        const items = await postgresDataSource.getRepository(Item).findBy({invoice});
        const addresses = await postgresDataSource.getRepository(Address).findBy({invoice});

        /*
        const newInvoice: any = {...invoice};
        newInvoice["clientAddress"] = addresses.find(address => address.attachedTo === "clientAddress");
        newInvoice["senderAddress"] = addresses.find(address => address.attachedTo === "senderAddress");*/
        res.status(200).json({newInvoice: invoice, items, addresses});
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
        invoice.status = "pending";
        const idList: number[] = [];

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
                const savedItem = await itemRepository.save(newItemRepo);
                idList.push(savedItem.id);
            } else{
                idList.push(item.id);
            }
        }

        const itemRepository = await postgresDataSource
            .getRepository(Item)
            .findBy({invoice: invoiceRepository});

        for(let item of itemRepository){
            if(!idList.includes(item.id)){
                const id = item.id;
                await postgresDataSource
                    .getRepository(Item)
                    .createQueryBuilder()
                    .delete()
                    .from('item')
                    .where('item.id = :id', {id})
                    .execute();
            }
        }

        for(let address of addresses){
            const id = address.id;
            await postgresDataSource
                .getRepository(Address)
                .createQueryBuilder()
                .update(Address)
                .set(address)
                .where("id = :id", {id})
                .execute();
        }

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

export async function markInvoiceAsPaid(req, res, next){
    try {
        const stringId = req.params.stringId;
        if(!stringId){
            throw "Could not extract the stringId from the request parameters..."
        }
        const updatedInvoice = await postgresDataSource
            .getRepository(Invoice)
            .createQueryBuilder()
            .update(Invoice)
            .set({status: "paid"})
            .where("stringId = :stringId", {stringId})
            .andWhere("status = 'pending'")
            .execute();

        if(updatedInvoice.affected === 0){
            res.status(400).json({
               success: false,
               message: `Invoice #${stringId} is already \"paid\" or is still a \"draft\"...`
            });
        }
        res.status(200).json({
            success: true,
            message: `Status from Invoice ${stringId} has changed from "pending" to "paid"...`
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error
        });
    }

}


export async function deleteInvoice(req, res, next){
    try {
        const stringId = req.params.stringId;
        if (!stringId) {
            throw "Could not extract the stringId from the request parameters..."
        }

        const invoice = await postgresDataSource
            .getRepository(Invoice)
            .findOne({
                where: {stringId},
                relations: {
                    addresses: true,
                    items: true
                }
            });

        for(let item of invoice.items){
            const id = item.id;
            await postgresDataSource
                .getRepository(Item)
                .createQueryBuilder()
                .delete()
                .from("item")
                .where("id = :id", {id})
                .execute();
        }

        for(let address of invoice.addresses){
            const id = address.id;
            await postgresDataSource
                .getRepository(Address)
                .createQueryBuilder()
                .delete()
                .from("address")
                .where("id = :id", {id})
                .execute();
        }

        await postgresDataSource
            .getRepository(Invoice)
            .createQueryBuilder()
            .delete()
            .from("invoice")
            .where("stringId = :stringId", {stringId})
            .execute();

        res.status(200).json({message: "success"});
    }
    catch (error){
        res.status(200).json({message: error});
    }
}

export async function saveAsDraft(req, res, next){
    try{
        const {invoice, addresses, items} = req.body;
        let isUnique = false;
        let result = '';
        while (!isUnique){
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            result += Math.floor(Math.random() * 9999);

            const invoiceDB = await postgresDataSource.getRepository(Invoice)
                .createQueryBuilder("invoice")
                .where("invoice.stringId = :result", {result})
                .getOne();

            isUnique = invoiceDB === null;
        }
        invoice.addresses = addresses;
        invoice.items = items;


    }
    catch(error){

    }
    res.status(200).json({
        success: true,
        message: `Invoice Created...`
    })
}