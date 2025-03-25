import { IsNotEmpty, IsString } from 'class-validator';

export class LoginStoreDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
