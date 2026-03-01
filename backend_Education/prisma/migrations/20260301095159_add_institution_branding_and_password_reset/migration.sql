-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "footerText" TEXT,
ADD COLUMN     "socialLinks" JSONB;

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "institutionId" SET DEFAULT '';

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");
