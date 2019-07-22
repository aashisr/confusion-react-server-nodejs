// Reducer file for configuration of login and logout
import * as ActionTypes from './ActionTypes';

// Starting state sets authentication based on token being in local storage
export const Auth = (
    state = {
        isLoading: false,
        isAuthenticated: localStorage.getItem('token') ? true : false,
        token: localStorage.getItem('token'),
        user: localStorage.getItem('creds') ? JSON.parse(localStorage.getItem('creds')) : null,
        errmes: null
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return { ...state, isLoading: true, isAuthenticated: false, user: action.creds };

        case ActionTypes.LOGIN_SUCCESS:
            return { ...state, isLoading: false, isAuthenticated: true, errmes: '', token: action.token };

        case ActionTypes.LOGIN_FAILURE:
            return { ...state, isLoading: false, isAuthenticated: false, errmes: action.message };

        case ActionTypes.LOGOUT_REQUEST:
            return { ...state, isLoading: true, isAuthenticated: true };

        case ActionTypes.LOGOUT_SUCCESS:
            return { ...state, isLoading: false, isAuthenticated: false, token: '', user: null };

        default:
            return { ...state };
    }
};
