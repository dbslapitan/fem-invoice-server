import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}