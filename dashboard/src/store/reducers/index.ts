import { combineReducers } from "redux";
import userReducer from "./userReducers";

export const rootReducer = combineReducers({ userReducer });
export type RootState = ReturnType<typeof rootReducer>;