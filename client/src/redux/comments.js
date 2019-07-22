import * as ActionTypes from "./ActionTypes";

export const Comments = (state = { errmes: null, comments: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            // Take the current value of state, modify the state and return it
            return { ...state, isLoading: false, errmes: null, comments: action.payload };

        case ActionTypes.COMMENTS_FAILED:
            return { ...state, isLoading: false, errmes: action.payload, comments: [] };

        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;

            //Can not modify the state sent as parameter, so concat (immutable operation)
            return { ...state, comments: state.comments.concat(comment) };

        default:
            return state;
    }
};
