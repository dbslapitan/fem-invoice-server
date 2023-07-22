import {Address} from "./address.model";
import {Item} from "./item.model";
import {Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Invoice{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stringId: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    paymentDue: Date;

    @Column()
    description: string;

    @Column()
    paymentTerms: number;

    @Column()
    clientName: string;

    @Column()
    clientEmail: string;

    @Column()
    status: string;

    @OneToOne(() => Address)
    @JoinColumn({name: "InvoiceId"})
    senderAddress: Address;

    @OneToOne(() => Address)
    @JoinColumn({name: "invoiceId"})
    clientAddress: Address;

    @OneToMany(() => Item, (item) => item.invoice)
    items: Item[];

    @Column({type: "numeric"})
    total: number;
}