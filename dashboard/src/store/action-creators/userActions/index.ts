import { Dispatch } from "redux";
import { UserActionType, UserActions } from "../../reducers/userReducers/types";
import { Incert, Login, GetAll, removeTokens, setAccessToken, setRefreshToken, Logout, setSelectedUser, ProfileUpdate, Edit, Block, Delete, Confirm } from "../../../services/api-user-service";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";


export const BlockUser = (email: string) => {

    return async (dispatch: Dispatch<UserActions>) => {
        try {

            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Block(email);
            const { response } = data;

            if (response.success) {
                localStorage.removeItem("updateUser");
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};

export const ConfirmUserEmail = (emailData: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Confirm(emailData);
            if (data == undefined) {
                toast.error("Something went wrong");
                dispatch({
                    type: UserActionType.FINISH_REQUEST,
                    payload: "",
                });
            }
            const { response } = data;

            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};

export const DeleteUser = (email: string) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Delete(email);
            const { response } = data;

            if (response.success) {
                localStorage.removeItem("updateUser");
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};

export const IncertUser = (user: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Incert(user);
            const { response } = data;

            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};
export const UpdateUserPrifile = (user: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await ProfileUpdate(user);
            const { response } = data;
            if (!response.isSuccess) {
                dispatch({
                    type: UserActionType.FINISH_REQUEST,
                    payload: response.message,
                });
                toast.error(response.message);
            } else {
                const { accessToken, refreshToken, message } = data.response;
                removeTokens();
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                AuthUser(accessToken, message, dispatch);
                toast.success(response.message);
            }
        } catch { }
    };
};
export const LoginUser = (user: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Login(user);
            const { response } = data;
            console.log("response ", response);

            if (response.success) {
                const { accessToken, refreshToken, message } = response;
                removeTokens();
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                toast.success(response.message);
                AuthUser(accessToken, response.message, dispatch);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};
export const GetAllUsers = () => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await GetAll();
            const { response } = data;
            if (response.success) {
                dispatch({
                    type: UserActionType.ALL_USERS_LOADED,
                    payload: response,
                });
            }
        } catch { }
    };
};

export const LogOut = (id: string) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Logout(id);
            const { response } = data;
            if (response.success) {
                removeTokens();
                toast.success(response.message);
                dispatch({
                    type: UserActionType.LOGOUT_USER,
                });
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};
export const SelectdUser = (user: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        dispatch({ type: UserActionType.SELECTED_USER, payload: user });
        setSelectedUser(user);
    };
};
export const EditUser = (user: any) => {
    return async (dispatch: Dispatch<UserActions>) => {
        try {
            dispatch({ type: UserActionType.START_REQUEST });
            const data = await Edit(user);
            const { response } = data;

            if (response.success) {
                localStorage.removeItem("updateUser");
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
            dispatch({
                type: UserActionType.FINISH_REQUEST,
                payload: response.message,
            });
        } catch { }
    };
};


export const AuthUser = (
    token: string,
    message: string,
    dispatch: Dispatch<UserActions>
) => {
    const decodedToken = jwtDecode(token) as any;
    dispatch({
        type: UserActionType.LOGIN_USER_SUCCESS,
        payload: {
            message,
            decodedToken,
        },
    });
};