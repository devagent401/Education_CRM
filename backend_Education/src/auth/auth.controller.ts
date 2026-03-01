import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto, LoginResponseDto } from '../presentation/auth/dto/login.dto';
import { RegisterDto } from '../presentation/auth/dto/register.dto';
import { SuperAdminLoginDto } from '../presentation/auth/dto/super-admin-login.dto';
import { RefreshTokenDto } from '../presentation/auth/dto/refresh-token.dto';
import { ForgotPasswordDto } from '../presentation/auth/dto/forgot-password.dto';
import { ChangePasswordDto } from '../presentation/auth/dto/change-password.dto';
import { ResetPasswordDto } from '../presentation/auth/dto/reset-password.dto';
import { LoginUseCase } from '../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../application/auth/use-cases/register.use-case';
import { SuperAdminLoginUseCase } from '../application/auth/use-cases/super-admin-login.use-case';
import { RefreshTokenUseCase } from '../application/auth/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../application/auth/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from '../application/auth/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../application/auth/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../application/auth/use-cases/change-password.use-case';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user?: { id: string; institutionId: string; email: string; role: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly superAdminLoginUseCase: SuperAdminLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'User registration', // add the summary to the operation
    description:
      'Register a new user for an institution. Returns tokens for auto-login.', // add the description to the operation
  })
  @ApiBody({ type: RegisterDto }) // add the body to the operation
  @ApiResponse({
    status: 201, // add the status to the response
    description: 'User registered successfully', // add the description to the response
    type: LoginResponseDto, // add the type to the response
  })
  @ApiResponse({ status: 400, description: 'Institution not found' }) // add the response to the operation
  @ApiResponse({ status: 409, description: 'Email already registered' }) // add the response to the operation
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerUseCase.execute({
      institutionId: dto.institutionId,
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: dto.role as any,
      phone: dto.phone,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    };
  }

  @Public()
  @Post('super-admin/login')
  @ApiOperation({
    summary: 'Super Admin login',
    description:
      'Platform-level Super Admin authentication. No institution required. Use credentials from seed script.',
  })
  @ApiBody({ type: SuperAdminLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async superAdminLogin(@Body() dto: SuperAdminLoginDto) {
    const result = await this.superAdminLoginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Institution user login. Find user by email, auto-detect institution. Returns tokens, user profile, and institution info.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      institution: result.institution,
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'New tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute({
      refreshToken: dto.refreshToken,
    });
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout(@Body() dto: RefreshTokenDto) {
    return this.logoutUseCase.execute(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset email sent (or token in dev)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto.token, dto.newPassword);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (authenticated)' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed' })
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: AuthRequest) {
    const user = req.user!;
    return this.changePasswordUseCase.execute(
      user.id,
      user.institutionId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
