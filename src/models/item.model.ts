import {Invoice} from "./invoice.model";
import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

export class Item{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    total: number;

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    invoice: Invoice;
}