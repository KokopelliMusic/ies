import { configureStore, ThunkAction, Action, applyMiddleware } from '@reduxjs/toolkit'
import { playerSlice } from './PlayerSlice'
import { createWrapper } from 'next-redux-wrapper'
import { save, load } from "redux-localstorage-simple"
import { settingsSlice } from './SettingsSlice'
import { enabledGamesSlice } from './EnabledGamesSlice'

const makeStore = () =>
	configureStore({
		reducer: {
			[playerSlice.name]: playerSlice.reducer,
			[settingsSlice.name]: settingsSlice.reducer,
			[enabledGamesSlice.name]: enabledGamesSlice.reducer,
		},
		devTools: true,

		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save()),
		preloadedState: load(),
	})

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true })