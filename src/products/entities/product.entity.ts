import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from "@nestjs/swagger/dist/decorators";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'uuid',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty()
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];


    //images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;    

    @BeforeInsert()
    checkSlugInsert() {

        if( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/'/g, '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/'/g, '');
        
    }

}