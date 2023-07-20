import {Address} from "./address.model";
import {Item} from "./item.model";
import {Column, CreateDateColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {JoinColumn} from "typeorm/browser";

export class Invoice{

    @PrimaryGeneratedColumn()
    psqlId: number;

    @Column()
    id: string;

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
    @JoinColumn()
    senderAddress: Address;

    @OneToOne(() => Address)
    @JoinColumn()
    clientAddress: Address;

    @OneToMany(() => Item, (item) => item.invoice)
    items: Item[];
}