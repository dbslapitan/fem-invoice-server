"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresDataSource = void 0;
var typeorm_1 = require("typeorm");
var address_model_1 = require("../models/address.model");
var invoice_model_1 = require("../models/invoice.model");
var item_model_1 = require("../models/item.model");
exports.postgresDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    ssl: true,
    extra: {
        ssl: { rejectUnauthorized: false }
    },
    entities: [
        address_model_1.Address,
        invoice_model_1.Invoice,
        item_model_1.Item
    ],
    synchronize: true,
    logging: true
});
