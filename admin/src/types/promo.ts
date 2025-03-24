export interface PromoCode {
  _id: string;
  code: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  description: string;
}