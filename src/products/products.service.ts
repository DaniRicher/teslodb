import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { validate as isUUID } from "uuid";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ) {}

  async create(createProductDto: CreateProductDto) {

    try {
      
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async findAll( paginationDto: PaginationDto ) {

    try {
      const { limit = 10, offset= 0 } = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        //TODO: relaciones
      });
      return products;
      
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findOne( term: string ) {

      let product: Product;

      if( isUUID( term ) ) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();
      }

      if( !product ) {
        throw new NotFoundException(`Product with id ${ term } not found`);
      }

    try {
      
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto ) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if( !product ) {
      throw new NotFoundException(`Product with id: ${ id } not found`)
    }

    try {

      await this.productRepository.save( product );
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    try {

      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions( error: any ) {

    if(error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}