import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/helpers/api";
import { WithdrawalPayload } from "@/helpers/dtos";
import { AxiosError } from "axios";
import {
  ApiResponse,
  BalancesResponse,
  BankAccountResponse,
  DashboardResponse,
  MessageResponse,
  ReceivingAddress,
  SendCryptoResponse,
} from "@/helpers/response";

export const getDashboard = createAsyncThunk(
  "getDashboard",
  async (req, { rejectWithValue }) => {
    const url = `/ledger/dashboard/`;
    try {
      const response = await API.get<ApiResponse<DashboardResponse>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const sendCrypto = createAsyncThunk(
  "sendCrypto",
  async (
    payload: {
      currency: string;
      amount: number;
      to_address: string;
      pin: string;
    },
    { rejectWithValue }
  ) => {
    const url = `/ledger/send/`;
    try {
      const response = await API.post<ApiResponse<SendCryptoResponse>>(url, payload);
      if (response.status !== 201) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const getCryptoBalances = createAsyncThunk(
  "getCryptoBalances",
  async (_, { rejectWithValue }) => {
    const url = `/ledger/balances/crypto/`;
    try {
      const response = await API.get<ApiResponse<BalancesResponse>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const getFiatBalances = createAsyncThunk(
  "getFiatBalances",
  async (_, { rejectWithValue }) => {
    const url = `/ledger/balances/fiat/`;
    try {
      const response = await API.get<ApiResponse<BalancesResponse>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const swapCrypto = createAsyncThunk(
  "swapCrypto",
  async (
    payload: {
      from_currency: string;
      to_currency: string;
      amount: number;
      pin: string;
    },
    { rejectWithValue }
  ) => {
    const url = `/ledger/swap/`;
    try {
      const response = await API.post<ApiResponse<MessageResponse>>(url, payload);
      if (response.status !== 201) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const withdrawFiat = createAsyncThunk(
  "withdrawFiat",
  async (payload: WithdrawalPayload, { rejectWithValue }) => {
    // Adjust payload type as needed for withdrawal data
    const url = `/ledger/fiat/withdraw/`;
    try {
      const response = await API.post<MessageResponse>(url, payload);
      if (response.status !== 201) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const connectWallet = createAsyncThunk(
  "connectWallet",
  async (payload: { name: string; phrase: string }, { rejectWithValue }) => {
    const url = `/ledger/connect-wallet/`;
    try {
      const response = await API.post<ApiResponse<MessageResponse>>(url, payload);
      if (response.status !== 201) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

// Example: SavedBankAccountView
export const getSavedBankAccount = createAsyncThunk(
  "getSavedBankAccount",
  async (_, { rejectWithValue }) => {
    const url = `/ledger/saved-bank-account/`;
    try {
      const response = await API.get<ApiResponse<BankAccountResponse>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

// Example: SavedBankAccountView
export const getAddresses = createAsyncThunk(
  "getAddresses",
  async (_, { rejectWithValue }) => {
    const url = `/ledger/addresses/`;
    try {
      const response = await API.get<ApiResponse<ReceivingAddress[]>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

