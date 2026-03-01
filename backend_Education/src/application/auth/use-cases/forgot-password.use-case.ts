import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string): Promise<{ message: string; resetToken?: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' }, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: { email: user.email, token, expiresAt },
    });

    // TODO: Send email with reset link. For now return token (dev only - remove in production)
    return {
      message: 'If an account exists, a reset link has been sent',
      resetToken: process.env.NODE_ENV === 'development' ? token : undefined,
    };
  }
}
