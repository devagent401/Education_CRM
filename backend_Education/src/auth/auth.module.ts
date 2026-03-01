import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginUseCase } from '../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../application/auth/use-cases/register.use-case';
import { SuperAdminLoginUseCase } from '../application/auth/use-cases/super-admin-login.use-case';
import { RefreshTokenUseCase } from '../application/auth/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../application/auth/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from '../application/auth/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../application/auth/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../application/auth/use-cases/change-password.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'change-me-in-production',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    SuperAdminLoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    ChangePasswordUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
