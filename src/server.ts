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

const port = normalizePort(process.env.PORT || 3000);

app.listen(port, () => {
    logger.info(`Server started at PORT ${port}`)
});