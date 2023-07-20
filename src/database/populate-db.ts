import * as dotenv from "dotenv";

const dotenvConfig = dotenv.config();

import "reflect-metadata";
import {postgresDataSource} from "../config/data-source";
import {INVOICES} from "./db-data";
import {DeepPartial} from "typeorm";
import {Invoice} from "../models/invoice.model";
import {Address} from "../models/address.model";
import {Item} from "../models/item.model";

async function populateDb(){
    await postgresDataSource.initialize();
    console.log('Datasource Initialized...');

    const invoices = Object.values(INVOICES);

    const invoiceRepository = postgresDataSource.getRepository(Invoice);
    const addressRepository = postgresDataSource.getRepository(Address);
    const itemRepository = postgresDataSource.getRepository(Item);

    for(let invoice of invoices){
        const {senderAddress, clientAddress, items, id, ...remaining} = invoice;
        const stringId = id;
        const newInvoiceRepository = invoiceRepository.create({...remaining, stringId});
        const saveInvoice = invoiceRepository.save(newInvoiceRepository);

        const newSenderRepository = addressRepository.create(senderAddress);
        const newClientRepository = addressRepository.create(clientAddress);
        const saveClient = addressRepository.save(newClientRepository);
        const saveSender = addressRepository.save(newSenderRepository);
        await Promise.all([saveInvoice, saveClient, saveSender]);

        for(let item of invoice.items){
            const newItemRepository = itemRepository.create(item);
            await itemRepository.save(newItemRepository);
        }
    }
}

populateDb().then(() => console.log('Finished populating database...')).catch(error => console.log(error));