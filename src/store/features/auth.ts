"use client";

import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from "../store";
import { AuthToken, User } from "@/helpers/response";
import { AUTH_TOKENS_KEY, AUTH_USER_KEY } from "@/helpers/constants";

export interface AuthState {
  loading: boolean;
  user: User | null;
  tokens: AuthToken | null;
}

function loadState<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  const serializedState = localStorage.getItem(key);
  if (serializedState === null) {
    return null;
  }
  return JSON.parse(serializedState);
}

// Initial state
const initialState: AuthState = {
  loading: false,
  user: loadState<User>(AUTH_USER_KEY),
  tokens: loadState<AuthToken>(AUTH_TOKENS_KEY),
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    execLogin(state, action) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user));
      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(action.payload.tokens));
    },
    setUser(state, action) {
      console.log(action.payload);
      state.user = action.payload;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload));
    },
    execLogout(state) {
      state.user = null;
      state.tokens = null;
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKENS_KEY);
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        // @ts-expect-error: Unreachable code error
        ...action.payload.nav,
      };
    });
  },
});

export const { startLoading, stopLoading, execLogin, execLogout, setUser } =
  authSlice.actions;

export const selectLoginLoading = (state: RootState) => state.auth.loading;
export const selectUser = (state: RootState) => state.auth.user;
export const selectTokens = (state: RootState) => state.auth.tokens;

export default authSlice.reducer;
