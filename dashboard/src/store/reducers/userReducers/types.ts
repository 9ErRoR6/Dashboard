import { type } from "os";

export interface UserState {
    allUsers: any,
    loading: boolean,
    message: string,
    isAuth: boolean,
    selectedUser: any
    user: any,
}

export enum UserActionType {
    START_REQUEST = "START_REQUEST",
    ALL_USERS_LOADED = "ALL_USERS_LOADED",
    FINISH_REQUEST = "FINISH_REQUEST",
    LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS",
    LOGOUT_USER = "LOGOUT_USER",
    SELECTED_USER = "SELECTED_USER",
}

interface StartRequestAction {
    type: UserActionType.START_REQUEST
}

interface AllUsersLoadedAction {
    type: UserActionType.ALL_USERS_LOADED,
    payload: any
}
interface FinishRequestAction {
    type: UserActionType.FINISH_REQUEST;
    payload: any;
}
interface LoginUserSuccessAction {
    type: UserActionType.LOGIN_USER_SUCCESS;
    payload: any;
}
interface LogoutUserAction {
    type: UserActionType.LOGOUT_USER;
}
interface SelectUserAction {
    type: UserActionType.SELECTED_USER;
    payload: any;
}

export type UserActions = StartRequestAction | AllUsersLoadedAction | FinishRequestAction | LoginUserSuccessAction | LogoutUserAction | SelectUserAction;