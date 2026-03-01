import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum RegisterRoleDto {
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUARDIAN = 'GUARDIAN',
  ACCOUNTANT = 'ACCOUNTANT',
}

export class RegisterDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  @IsString()
  @IsNotEmpty()
  institutionId: string;

  @ApiProperty({ example: 'teacher@school.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: RegisterRoleDto })
  @IsEnum(RegisterRoleDto)
  role: RegisterRoleDto;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
}
