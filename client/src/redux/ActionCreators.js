//Import everything that is being exported from ActionType.js
import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';
import fetch from 'cross-fetch';

//Export the function to add comment as postComment action
// Thunk returns function instead of an action object
export const postComment = (dishId, rating, author, comment) => (dispatch) => {
    const newComment = {
        dishId: dishId,
        rating: rating,
        author: author,
        comment: comment
    };
    newComment.date = new Date().toISOString();

    //POST the comment to json-server using fetch's post operation
    return fetch(baseUrl + 'comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((response) => dispatch(addComment(response)))
        .catch((error) => {
            console.log('Post comment ', error.message);
            alert('Error in posting comment. ' + error.message);
        });
};

export const addComment = (comment) => ({
    type: ActionTypes.ADD_COMMENT,
    // Data to be added as comment sent as payload
    payload: comment
});

//DISHES

//Create fetchDishes as a thunk, returns dispatch as a function
// Thunk returns function instead of an action object
export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));

    //Fetch dishes from server using fetch API, convert the response to json and Dispacth a call to addDishes function
    return fetch(baseUrl + 'dishes')
        .then(
            // Receive response from the server
            (response) => {
                //Handle the errors
                // if response.ok is true, then the request was successful
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    //Throw the error to the catch function
                    throw error;
                }
            },
            // Could not receive response from the server
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((dishes) => {
            // Add the dishes returned by the server to the redux store
            dispatch(addDishes(dishes));
        })
        .catch((error) => dispatch(dishesFailed(error.message)));
};

//This is not a thunk since it is returning an action opject
export const dishesLoading = () => {
    // Return an DISHES_LOADING action without data
    return {
        type: ActionTypes.DISHES_LOADING
    };
};

export const dishesFailed = (errmes) => {
    return {
        type: ActionTypes.DISHES_FAILED,
        payload: errmes
    };
};

export const addDishes = (dishes) => {
    return {
        type: ActionTypes.ADD_DISHES,
        payload: dishes
    };
};

//COMMENTS

export const fetchComments = () => (dispatch) => {
    //Fetch comments from server using fetch API, convert the response to json and Dispacth a call to addComments function
    return fetch(baseUrl + 'comments')
        .then(
            // Receive response from the server
            (response) => {
                //Handle the errors
                // if response.ok is true, then the request was successful
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    //Throw the error to the catch function
                    throw error;
                }
            },
            // Could not receive response from the server
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((comments) => dispatch(addComments(comments)))
        .catch((error) => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = (errmes) => {
    return {
        type: ActionTypes.COMMENTS_FAILED,
        payload: errmes
    };
};

export const addComments = (comments) => {
    return {
        type: ActionTypes.ADD_COMMENTS,
        payload: comments
    };
};

//PROMOS

export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));

    return fetch(baseUrl + 'promotions')
        .then(
            // Receive response from the server
            (response) => {
                //Handle the errors
                // if response.ok is true, then the request was successful
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    //Throw the error to the catch function
                    throw error;
                }
            },
            // Could not receive response from the server
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((promos) => dispatch(addPromos(promos)))
        .catch((error) => dispatch(promosFailed(error.message)));
};

export const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmes) => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmes
});

export const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});

// LEADERS
export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading(true));

    return fetch(baseUrl + 'leaders')
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((leaders) => dispatch(addLeaders(leaders)))
        .catch((error) => {
            dispatch(leadersFailed(error.message));
        });
};

export const leadersLoading = () => {
    return {
        type: ActionTypes.LEADERS_LOADING
    };
};

export const addLeaders = (leaders) => {
    return {
        type: ActionTypes.ADD_LEADERS,
        payload: leaders
    };
};

export const leadersFailed = (errmes) => {
    return {
        type: ActionTypes.LEADERS_FAILED,
        payload: errmes
    };
};

export const postFeedback = (firstname, lastname, telnum, email, agree, contactType, message) => (dispatch) => {
    //Create a javascript object for feedback
    const newFeedback = {
        firstname: firstname,
        lastname: lastname,
        telnum: telnum,
        email: email,
        agree: agree,
        contactType: contactType,
        message: message
    };
    newFeedback.date = new Date().toISOString();

    //POST the feedback to json-server using fetch's post operation
    return fetch(baseUrl + 'feedback', {
        method: 'POST',
        body: JSON.stringify(newFeedback),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
        .then(
            (response) => {
                console.log('Response postFeedback ' + JSON.stringify(response));
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                let errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((response) => dispatch(addFeedback(response)))
        .catch((error) => {
            console.log('Post comment ', error.message);
            alert('Error in posting comment. ' + error.message);
        });
};

export const addFeedback = (feedback) => {
    return {
        type: ActionTypes.ADD_FEEDBACK,
        payload: feedback
    };
};

// USER AUTHORIZATION

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    };
};

export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    };
};

export const loginFailure = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    };
};

export const loginUser = (creds) => (dispatch) => {
    // Dispatch requestLogin to start the call to the login API
    dispatch(requestLogin(creds));

    // fetch POST request to login route in the server
    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    let error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                throw error;
            }
        )
        .then((response) => response.json())
        .then((response) => {
            // response.success is set as true or false in server
            if (response.success) {
                // If login was successful, set the token received from server in local storage
                localStorage.setItem('token', response.token);
                // Also store the user's credentials in local storage
                localStorage.setItem('creds', JSON.stringify(creds));

                // Dispatch fetchFavorites only after login
                dispatch(fetchFavorites());
                // Dispatch the success action
                dispatch(receiveLogin(response));
            } else {
                let error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        })
        .catch((error) => dispatch(loginFailure(error.message)));
};

export const requestLogout = () => {
    return {
        type: ActionTypes.LOGOUT_REQUEST
    };
};

export const receiveLogout = () => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    };
};

export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout());

    // Remove the token and user's credentials from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(favoritesFailed('Error 401: Unauthorized'));
    dispatch(receiveLogout());
};

// FAVORITES
export const postFavorite = (dishId) => (dispatch) => {
    // beares is used to send the token to authorize the user in the server
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favorites/' + dishId, {
        method: 'POST',
        body: JSON.stringify({ _id: dishId }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: bearer
        },
        credentials: 'same-origin'
    })
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                throw error;
            }
        )
        .then((response) => response.json())
        .then((favorites) => {
            console.log('Favorite Added', favorites);
            // Add the favorites returned by the server to the redux store
            dispatch(addFavorites(favorites));
        })
        .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const deleteFavorite = (dishId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favorites/' + dishId, {
        method: 'DELETE',
        headers: {
            Authorization: bearer
        },
        credentials: 'same-origin'
    })
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                throw error;
            }
        )
        .then((response) => response.json())
        .then((favorites) => {
            console.log('Favorite Deleted', favorites);
            dispatch(addFavorites(favorites));
        })
        .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const fetchFavorites = () => (dispatch) => {
    dispatch(favoritesLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'favorites', {
        headers: {
            Authorization: bearer
        }
    })
        .then(
            (response) => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            (error) => {
                var errmes = new Error(error.message);
                throw errmes;
            }
        )
        .then((response) => response.json())
        .then((favorites) => dispatch(addFavorites(favorites)))
        .catch((error) => dispatch(favoritesFailed(error.message)));
};

export const favoritesLoading = () => ({
    type: ActionTypes.FAVORITES_LOADING
});

export const favoritesFailed = (errmess) => ({
    type: ActionTypes.FAVORITES_FAILED,
    payload: errmess
});

export const addFavorites = (favorites) => ({
    type: ActionTypes.ADD_FAVORITES,
    payload: favorites
});
