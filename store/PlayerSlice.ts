import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState: string[] = [];

// Actual Slice
export const playerSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    removePlayer(state, action) {
      return state.filter((_, id) => action.payload !== id)
    },
    addPlayer(state, action) {
      state.push(action.payload);
    },
    editPlayerName(state, action) {
      state[action.payload.id] = action.payload.name;
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

export const { addPlayer, editPlayerName, removePlayer } = playerSlice.actions;

export const selectPlayerState = (state: AppState) => state.players;

export default playerSlice.reducer;