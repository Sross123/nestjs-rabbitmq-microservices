import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  product!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}