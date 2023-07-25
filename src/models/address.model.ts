import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Invoice} from "./invoice.model";

@Entity()
export class Address{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    postCode: string;

    @Column()
    country: string;

    @Column()
    attachedTo: string;

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    invoice: Invoice
}