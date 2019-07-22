import * as ActionTypes from './ActionTypes';

export const Favorites = (
    state = {
        isLoading: true,
        errmes: null,
        favorites: null
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITES:
            return { ...state, isLoading: false, errmes: null, favorites: action.payload };

        case ActionTypes.FAVORITES_LOADING:
            return { ...state, isLoading: true, errmes: null, favorites: null };

        case ActionTypes.FAVORITES_FAILED:
            return { ...state, isLoading: false, errmes: action.payload, favorites: null };

        default:
            return state;
    }
};
