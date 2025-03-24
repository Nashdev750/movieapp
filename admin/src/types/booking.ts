export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Canceled = 2,
}

export interface Booking {
  _id: string;
  branchName: string;
  date: string;
  time: string;
  fullName: string;
  phoneNumber: string;
  status: BookingStatus;
  promoCode?: string;
  discountPercentage?: number;
}