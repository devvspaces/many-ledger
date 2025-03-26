import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/helpers/api";
import { AxiosError } from "axios";

export const getNotifications = createAsyncThunk(
  "getNotifications",
  async (req, { rejectWithValue }) => {
    const url = `/account/notifications/`;
    try {
      const response = await API.get<Notification[]>(url);
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
