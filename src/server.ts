import * as dotenv from "dotenv";

const dotenvConfig = dotenv.config();

import { normalizePort } from "./utils";
import { logger } from "./config/logger";

const app = require("./config/app");

const port = normalizePort(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info(`Server started at PORT ${port}`)
});