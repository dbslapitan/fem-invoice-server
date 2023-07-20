import {Column, PrimaryGeneratedColumn} from "typeorm";

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
}