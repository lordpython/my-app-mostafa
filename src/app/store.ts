// src\app\store.ts
import type { Middleware} from "@reduxjs/toolkit";
import { configureStore, Store } from "@reduxjs/toolkit"
import gameReducer from "../features/game/gameSlice"
import { quotesApi } from "../features/quotes/quotesApiSlice"

// Define our state type
export interface StoreState {
  game: ReturnType<typeof gameReducer>
  [quotesApi.reducerPath]: ReturnType<typeof quotesApi.reducer>
}

// Create store with proper type annotations
export const makeStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer,
      [quotesApi.reducerPath]: quotesApi.reducer,
    },
    middleware: getDefaultMiddleware => 
      getDefaultMiddleware().concat(quotesApi.middleware as Middleware),
  })
}

// Create the store instance
export const store = makeStore()

// Infer types from the store
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
