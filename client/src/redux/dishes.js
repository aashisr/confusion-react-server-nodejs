import * as ActionTypes from './ActionTypes';

//Configure according to different action types
export const Dishes = (state = { isLoading: true, errmes: null, dishes: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DISHES:
            return { ...state, isLoading: false, errmes: null, dishes: action.payload };

        case ActionTypes.DISHES_LOADING:
            // Take the current value of state, modify the state and return it
            return { ...state, isLoading: true, errmes: null, dishes: [] };

        case ActionTypes.DISHES_FAILED:
            return { ...state, isLoading: false, errmes: action.payload, dishes: [] };

        // Return dishes withour modifying anything
        default:
            return state;
    }
};
