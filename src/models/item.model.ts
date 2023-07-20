import {Invoice} from "./invoice.model";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Item{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    quantity: number;

    @Column({type: "numeric"})
    price: number;

    @Column({type: "numeric"})
    total: number;

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    @JoinColumn({name: 'invoiceId'})
    invoice: Invoice;
}