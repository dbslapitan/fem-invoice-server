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

    const invoices = INVOICES;

    const invoiceRepository = postgresDataSource.getRepository(Invoice);
    const addressRepository = postgresDataSource.getRepository(Address);
    const itemRepository = postgresDataSource.getRepository(Item);

    for(let invoice of invoices){
        const {senderAddress,
            clientAddress,
            items,
            id,
            ...remaining
            } = invoice;
        const stringId = id;
        const client = "clientAddress";
        const sender = "senderAddress";

        const invoiceString = JSON.stringify(remaining);
        const newInvoice = JSON.parse(invoiceString) as Partial<Invoice>;
        newInvoice.stringId = stringId;

        const senderAddressString = JSON.stringify(senderAddress);
        const newSenderAddress = JSON.parse(senderAddressString) as Partial<Address>;
        newSenderAddress.attachedTo = sender;

        const clientAddressString = JSON.stringify(clientAddress);
        const newClientAddress = JSON.parse(clientAddressString) as Partial<Address>;
        newClientAddress.attachedTo = client;

        console.log(newSenderAddress, newClientAddress);

        const newInvoiceRepository = invoiceRepository.create(newInvoice as Invoice);
        await invoiceRepository.save(newInvoiceRepository);

        newSenderAddress.invoice = newInvoiceRepository;
        newClientAddress.invoice = newInvoiceRepository;

        const newSenderRepository = addressRepository.create(newSenderAddress as Address);
        await addressRepository.save(newSenderRepository);
        const newClientRepository = addressRepository.create(newClientAddress as Address);
        await addressRepository.save(newClientRepository);

        for(let item of invoice.items){
            const newItem = item as Partial<Item>;
            newItem.invoice = newInvoiceRepository;
            const newItemRepository = itemRepository.create(newItem);
            await itemRepository.save(newItemRepository);
        }
    }
}

populateDb().then(() => {
    console.log('Finished populating database...');
    process.exit(0);
}).catch(error => {
    console.log(error);
    process.exit(1);
});