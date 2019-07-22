import * as ActionTypes from "./ActionTypes";

export const Leaders = (state = { isLoading: true, errmes: null, leaders: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_LEADERS:
            return { ...state, isLoading: false, errmes: null, leaders: action.payload };

        case ActionTypes.LEADERS_LOADING:
            return { ...state, isLoading: true, errmes: null, leaders: [] };

        case ActionTypes.LEADERS_FAILED:
            return { ...state, isLoading: false, errmes: action.payload, leaders: [] };

        default:
            return state;
    }
};
