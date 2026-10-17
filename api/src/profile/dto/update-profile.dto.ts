import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  displayName?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsEmail()
  @MaxLength(255)
  email?: string;
}
