import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/helpers/api";
import { AxiosError } from "axios";
import { Notification, ApiResponse } from "@/helpers/response";

export const getNotifications = createAsyncThunk(
  "getNotifications",
  async (req, { rejectWithValue }) => {
    const url = `/account/notifications/`;
    try {
      const response = await API.get<ApiResponse<Notification[]>>(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);

export const countUnreadNotifications = createAsyncThunk(
  "countUnreadNotifications",
  async (req, { rejectWithValue }) => {
    const url = `/account/notifications/unread/`;
    try {
      const response = await API.get<
        ApiResponse<{
          count: number;
        }>
      >(url);
      if (response.status !== 200) {
        return rejectWithValue(response.data);
      }
      return response.data.data.count;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue(err);
    }
  }
);
