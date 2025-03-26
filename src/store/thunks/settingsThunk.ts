import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/helpers/api";
import { UpdateProfile } from "@/helpers/dtos";
import { AxiosError } from "axios";
import { Profile } from "@/helpers/response";

export const changeUsername = createAsyncThunk(
  "changeUsername",
  async (
    req: {
      new_username: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    const url = `/account/change-username/`;
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

export const setPin = createAsyncThunk(
  "setPin",
  async (
    req: {
      new_pin: string;
    },
    { rejectWithValue }
  ) => {
    const url = `/account/set-pin/`;
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

export const changePin = createAsyncThunk(
  "changePin",
  async (
    req: {
      new_pin: string;
      old_pin: string;
    },
    { rejectWithValue }
  ) => {
    const url = `/account/change-pin/`;
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

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (req: UpdateProfile, { rejectWithValue }) => {
    const url = `/account/profile/`;
    try {
      const response = await API.patch<Profile>(url, req);
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

export const updateKyc = createAsyncThunk(
  "updateKyc",
  async (data: FormData, { rejectWithValue }) => {
    const url = `/account/profile/update-kyc/`;
    try {
      const response = await API.patch(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

export const getProfile = createAsyncThunk(
  "getProfile",
  async (req, { rejectWithValue }) => {
    const url = `/account/profile/`;
    try {
      const response = await API.get<Profile>(url);
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
