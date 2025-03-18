import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phonenumber: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}
