import {Invoice} from "./models/invoice.model";

export function normalizePort(val){
    const port = parseInt(val, 10);
    if(isNaN(port)){
        return val;
    }
    if(port > 0){
        return port;
    }
    return false;
}
