import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

interface SettingsState {
  timeOnScreen: number
}

// Initial state
const initialState: SettingsState = {
  timeOnScreen: 60,
}

// Actual Slice
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    editTimeOnScreen(state, action) {
      state.timeOnScreen = action.payload
    },

  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.players,
      };
    },
  },
});

export const { editTimeOnScreen } = settingsSlice.actions;

export const selectSettingsState = (state: AppState) => state.settings;

export default settingsSlice.reducer;