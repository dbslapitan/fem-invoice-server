import { NextFunction, Request, Response } from "express";
import {logger} from "./logger";

export function customErrorHandler (error, req: Request, res: Response, next: NextFunction){
    logger.error(error);
    if(res.headersSent){
        logger.error(`Response already sent... Delegating to the default express error handler...`);
        return next(error);
    }
    res.sendStatus(500);
}