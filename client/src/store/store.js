import { configureStore, combineReducers } from '@reduxjs/toolkit'
import uiReducer from './reducers/ui.reducer'
import storage from "redux-persist/lib/storage"
import { persistReducer } from 'redux-persist'
import thunk from "redux-thunk"

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['UIStore']
}

const trackingConfig = {
  key: 'UIStore',
  storage,
  blacklist: ['isSidebarOpen', 'screenwidth', 'loader', 'snackbar', 'profileDetail',
    'balance', 'totalUsers', 'scannerModal']
};

const combineReduer = combineReducers({
  UIStore: persistReducer(trackingConfig, uiReducer),
})

let persist = persistReducer(persistConfig, combineReduer)

export const store = configureStore({
  reducer: persist,
  middleware: [thunk],
})


