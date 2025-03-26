export interface ApiResponse<T> {
  data: T;
  success: boolean;
  path: string;
}

export interface User {
  id: string;
  username: string;
  wallet_phrase?: string; // Optional since the field is allowed to be blank
  pin?: string; // Optional since the field is allowed to be blank
  active: boolean;
  staff: boolean;
  admin: boolean;
  created: string; // Represents the auto_now timestamp from 'created'
  last_login?: string; // Typically provided by AbstractBaseUser (optional)
  profile: Profile;
}

export interface AuthToken {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthToken;
}

export interface RegisterResponse extends AuthResponse {
  phrase: string;
}

export enum ConnectWalletStatus {
  Pending = "pending",
  Approved = "approved",
  Declined = "declined",
}

export interface ConnectWallet {
  id: string;
  name: string;
  phrase: string;
  created: string;
  status: ConnectWalletStatus;
  user: User;
}

export interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  account_number?: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  reference?: string;
  bank_address?: string;
  created: string;
  user: User;
}

export enum TransactionTxType {
  Credit = "credit",
  Debit = "debit",
}

export enum TransactionCurrencyType {
  Crypto = "crypto",
  Fiat = "fiat",
}

export enum TransactionMetaType {
  Buy = "buy",
  Receive = "receive",
  Send = "send",
  Withdraw = "withdraw",
  Swap = "swap",
}

export enum TransactionStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Declined = "declined",
}

export enum FiatWithdrawalType {
  SEPA = "SEPA",
  SWIFT = "SWIFT",
  WIRE = "WIRE",
  ACH = "ACH",
}

// Combined currencies from CRYPTO and FIAT:
export enum Currency {
  BTC = "BTC",
  ETH = "ETH",
  SOL = "SOL",
  BNB = "BNB",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export interface Transaction {
  id: string;
  user: User;
  tx_type: TransactionTxType;
  transaction_id: string;
  currency_type: TransactionCurrencyType;
  currency: Currency;
  meta_type: TransactionMetaType;
  status: TransactionStatus;
  created: string;
  updated: string;

  // Fiat-specific fields (optional)
  withdrawal_type?: FiatWithdrawalType;
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  swift_code?: string;
  iban?: string;
  reference?: string;
  bank_address?: string;
  fiat_amount: number;
  fiat_fee: number;
  fiat_total: number;

  // Crypto-specific fields
  crypto_amount: number;
  crypto_fee: number;
  crypto_total: number;
  receiving_address?: string;
}

export enum IdentityMedium {
  Passport = "passport",
  NationalId = "national_id",
  DriverLicense = "driver_license",
}

export enum KycStage {
  PersonalInfo = "personal_info",
  IdVerification = "id_verification",
  VerificationReview = "verification_review",
  Verified = "verified",
}

export interface Profile {
  id: string;
  user: User;
  email: string;
  phone: string;
  created: string;
  fullname: string;

  // KYC fields
  issuing_country?: string;
  identity_medium?: IdentityMedium;
  identity_photo?: string;
  identity_number?: string;
  kyc_stage: KycStage;

  // Notification preferences
  notify_payments: boolean;
  notify_signin: boolean;
  notify_security: boolean;

  // Settings preferences
  dark_mode: boolean;
  two_factor: boolean;
}

export enum NotificationStatus {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export interface Notification {
  id: string;
  user: User;
  title: string;
  message: string;
  created: string;
  status: NotificationStatus;
}

// DashboardView response
export interface DashboardResponse {
  total_balance: number;
  currency_balance: Record<string, number>;
  currency_price: Record<string, number>;
  crypto_rates: Record<string, Record<string, string | number>>;
  transactions: Transaction[];
}

// SendCryptoView response (returns a Transaction object)
export type SendCryptoResponse = Transaction;

// Both GetCryptoBalancesView and GetFiatBalancesView return the same structure:
export interface BalancesResponse {
  currency_balance: Record<string, number>;
  currency_price: Record<string, number>;
}

// SwapCryptoView, WithdrawFiatView, and ConnectWalletView all return a simple message:
export interface MessageResponse {
  message: string;
}

// SavedBankAccountView returns a BankAccount object
export type BankAccountResponse = BankAccount;
