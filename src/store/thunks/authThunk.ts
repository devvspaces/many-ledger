import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/helpers/api";
import { execLogin, startLoading, stopLoading } from "../features/auth";
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from "@/helpers/dtos";
import { AxiosError } from "axios";
import { RegisterResponse } from "@/helpers/response";

export const login = createAsyncThunk(
  "login",
  async (req: LoginDto, { dispatch, rejectWithValue }) => {
    const url = `/account/login/`;
    dispatch(startLoading());
    try {
      const response = await API.post(url, req);
      dispatch(stopLoading());
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      dispatch(execLogin(response.data.data));
    } catch (err) {
      dispatch(stopLoading());
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const register = createAsyncThunk(
  "register",
  async (req: LoginDto, { rejectWithValue }) => {
    const url = `/account/register/`;
    try {
      const response = await API.post<RegisterResponse>(url, req);
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

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (req: ForgotPasswordDto, { rejectWithValue }) => {
    const url = `/account/forget-password/`;
    try {
      const response = await API.post(url, req);
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

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (req: ResetPasswordDto, { rejectWithValue }) => {
    const url = `/account/reset-password/`;
    try {
      const response = await API.patch(url, req);
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
