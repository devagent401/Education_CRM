import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'teacher@school.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginResponseUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: ['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'TEACHER', 'STUDENT', 'GUARDIAN', 'ACCOUNTANT'],
  })
  role: string;
}

export class LoginResponseInstitutionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  logoUrl?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ description: 'Token expiry in seconds' })
  expiresIn: number;

  @ApiProperty({ type: LoginResponseUserDto })
  user: LoginResponseUserDto;

  @ApiPropertyOptional({
    type: LoginResponseInstitutionDto,
    description: 'Present for institution users, absent for Super Admin',
  })
  institution?: LoginResponseInstitutionDto;
}
