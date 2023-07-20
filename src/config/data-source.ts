import {DataSource} from "typeorm";
import {Address} from "../models/address.model";
import {Invoice} from "../models/invoice.model";
import {Item} from "../models/item.model";

export const postgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    ssl:true,
    extra: {
        ssl: {rejectUnauthorized: false}
    },
    entities:[
        Address,
        Invoice,
        Item
    ],
    synchronize: true,
    logging: true
});