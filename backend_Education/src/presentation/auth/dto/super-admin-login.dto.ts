import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SuperAdminLoginDto {
  @ApiProperty({
    example: 'superadmin@platform.com',
    description: 'Super Admin email (no institution required)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SuperAdmin@123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
