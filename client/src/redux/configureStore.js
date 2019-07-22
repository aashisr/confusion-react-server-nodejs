import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createForms } from 'react-redux-form';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import { Favorites } from './favorites';
import { InitialFeedback } from './forms';
import { Auth } from './auth';

export const ConfigureStore = () => {
    //Create a store with redux createStore function
    //CreateStore takes enhancer as second parameter which here is applyMiddleware()
    const store = createStore(
        //Combine the reducers received from multiple files into a single reducer
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders,
            favorites: Favorites,
            auth: Auth,
            // Adds necessary reducer function and state information into createStore,
            // react-redux-form adds reducers, action creators etc by itself
            ...createForms({
                // InitialFeedback is supplied to reset the initial state of form after submitting
                feedback: InitialFeedback
            })
        }),
        // applyMiddleware() makes thunk and logger available within the application
        applyMiddleware(thunk, logger)
    );

    return store;
};
