import * as dotenv from "dotenv";

const dotenvConfig = dotenv.config();

import {postgresDataSource} from "../config/data-source";
import {Invoice} from "../models/invoice.model";
import {Address} from "../models/address.model";
import {Item} from "../models/item.model";

async function deleteDb() {
    await postgresDataSource.initialize();
    console.log(`Database connection ready.`);

    console.log(`Clearing LESSONS table.`)
    await postgresDataSource.getRepository(Invoice).delete({});

    console.log(`Clearing COURSES table.`)
    await postgresDataSource.getRepository(Address).delete({});

    console.log(`Clearing USERS table.`)
    await postgresDataSource.getRepository(Item).delete({});
}

deleteDb().then(() => {
    console.log(`Finished deleting database, exiting!`);
    process.exit(0);
}).catch(err => {
    console.error(`Error deleting database.`, err);
});