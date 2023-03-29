import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNumber, IsOptional, IsPositive, IsArray, IsInt, IsIn } from "class-validator";


export class CreateProductDto {

    @ApiProperty({
        default: 10, description: 'How many rows do you need'
    })
    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];


    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];



}
