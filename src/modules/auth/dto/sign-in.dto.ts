import { IsString } from 'class-validator';

export class SignInDTO {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
