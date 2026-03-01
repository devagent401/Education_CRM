import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async execute(token: string, newPassword: string): Promise<{ message: string }> {
    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.authService.hashPassword(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { email: resetRecord.email, deletedAt: null },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
