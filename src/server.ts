import * as dotenv from "dotenv";

const dotenvConfig = dotenv.config();

if(dotenvConfig.error){
    console.log(`Error on getting environment variables.`);
    process.exit(1);
}

import "reflect-metadata"
import { normalizePort } from "./utils";
import { logger } from "./config/logger";
import { app } from "./config/app";
import {postgresDataSource} from "./config/data-source";

const port = normalizePort(process.env.PORT || 3000);

postgresDataSource.initialize().then(() => {
    logger.info("Database successfully initialized...");
}).catch(error => {
    logger.error("Error occurred during database initialization...", error);
});

app.listen(port, () => {
    logger.info(`Server started at PORT ${port}`)
});