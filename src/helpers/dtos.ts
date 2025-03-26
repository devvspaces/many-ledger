export interface UpdateProfile {
  phone?: string;
  email?: string;
  fullname?: string;
  notify_payments?: boolean;
  notify_signin?: boolean;
  notify_security?: boolean;
  dark_mode?: boolean;
  two_factor?: boolean;
}

export interface UpdateKyc {
  issuing_country: string;
  identity_medium: string;
  identity_photo: File;
  identity_number: string;
}

export interface RefreshDto {
  refresh: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface ForgotPasswordDto {
  username: string;
  phrase: string;
}

export interface ResetPasswordDto extends ForgotPasswordDto {
  password: string;
}

export interface WithdrawalPayload {
  amount: number; // Should be a decimal (number or string depending on your needs)
  currency: string; // FIAT currency choice (e.g. "USD", "EUR", "GBP")
  withdrawal_type: string; // FIAT withdrawal type (e.g. "SEPA", "SWIFT", "WIRE", "ACH")
  account_name: string;
  bank_name: string;
  account_number?: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  reference?: string;
  bank_address?: string;
  save_details: boolean;
  pin: string;
}
