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
    paymentDue: string;

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
    @JoinColumn({name: "senderAddressId"})
    senderAddress: Address;

    @OneToOne(() => Address)
    @JoinColumn({name: "clientAddressId"})
    clientAddress: Address;

    @OneToMany(() => Item, (item) => item.invoice)
    items: Item[];
}