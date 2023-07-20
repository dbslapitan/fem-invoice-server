import * as winston from "winston";

export const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.File({
            filename: "logs/all.log"
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        })
    ]
});

if(process.env.NODE_ENV != "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}