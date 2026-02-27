/**
 * IdCard - Domain Entity
 * Pure domain model, no framework dependencies
 */
export type IdCardStatus = 'DRAFT' | 'ISSUED' | 'REVOKED';

export interface IdCardTemplate {
  id: string;
  institutionId: string;
  name: string;
  layout: Record<string, unknown>;
  fields: Record<string, string>;
  width: number;
  height: number;
  includeQrCode: boolean;
  isDefault: boolean;
}

export interface IdCard {
  id: string;
  institutionId: string;
  studentId: string;
  templateId: string;
  qrCodeData?: string;
  qrCodeUrl?: string;
  pdfUrl?: string;
  status: IdCardStatus;
}
