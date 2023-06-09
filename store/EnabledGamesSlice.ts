import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { GameTypes, gameTypeToname, getAmountOfGames } from '../types/game';

const initialState: number[] = Array.from(Array(getAmountOfGames()).keys())

// Actual Slice
export const enabledGamesSlice = createSlice({
  name: "enabledGames",
  initialState,
  reducers: {
    changeGame(state, action) {
      if (state.includes(action.payload)) {
        return state.filter(id => action.payload !== id)
      } else {
        state.push(action.payload);
      }
    }
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

export const { changeGame } = enabledGamesSlice.actions;

export const selectEnabledGamesState = (state: AppState) => state.enabledGames;

export default enabledGamesSlice.reducer;