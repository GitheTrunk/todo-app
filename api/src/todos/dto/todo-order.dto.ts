import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class TodoOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids!: number[];
}
