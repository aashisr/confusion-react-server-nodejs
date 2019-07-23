import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Favorites from './FavoriteComponent';
import Contact from './ContactComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import DishDetail from './DishDetailComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    postComment,
    postFeedback,
    fetchDishes,
    fetchPromos,
    fetchComments,
    fetchLeaders,
    loginUser,
    logoutUser,
    fetchFavorites,
    postFavorite,
    deleteFavorite
} from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapDispatchToProps = (dispatch) => {
    return {
        postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
        postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) =>
            dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message)),
        fetchDishes: () => dispatch(fetchDishes()),
        fetchComments: () => dispatch(fetchComments()),
        fetchPromos: () => dispatch(fetchPromos()),
        fetchLeaders: () => dispatch(fetchLeaders()),
        // actions.reset is imported from react-redux-form which adds necessary action to reset the form
        resetFeedbackForm: () => dispatch(actions.reset('feedback')),
        loginUser: (creds) => dispatch(loginUser(creds)),
        logoutUser: () => dispatch(logoutUser()),
        fetchFavorites: () => dispatch(fetchFavorites()),
        postFavorite: (dishId) => dispatch(postFavorite(dishId)),
        deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
    };
};

//Gets the state of the application as parameter from redux store,
//Maps the redux store state to props and makes it available to use in this component
const mapStateToProps = (state) => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders,
        favorites: state.favorites,
        auth: state.auth
    };
};

//Create new component Main as a container component
class Main extends Component {
    // Called just after the component gets mounted into the view of the application
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
        this.props.fetchFavorites();
    }

    //states defined in redux store becomes available as props instead of state because of mapStateToProps function
    render() {
        // declare HomePage component
        const HomePage = () => {
            return (
                // Pass featured dish, promotion and leader from the gven data
                <Home
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMes={this.props.dishes.errmes}
                    promotion={this.props.promotions.promotions.filter((promotion) => promotion.featured)[0]}
                    promosLoading={this.props.promotions.isLoading}
                    promoErrMes={this.props.promotions.errmes}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    leadersLoading={this.props.leaders.isLoading}
                    leadersErrMes={this.props.leaders.errmes}
                />
            );
        };

        // match is one of the three params provided by React router which holds the route and its params info
        const DishWithId = ({ match }) => {
            // Check if favorites.favorites and favorites.favorites.dishes exists
            let favorite;
            if (this.props.favorites.favorites) {
                if (this.props.favorites.favorites.dishes) {
                    favorite = this.props.favorites.favorites.dishes.some((dish) => dish._id === match.params.dishId);
                } else {
                    favorite = null;
                }
            } else {
                favorite = null;
            }

            return (
                // comment.dishId and match.params.dishId both are strings
                <DishDetail
                    dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMes={this.props.dishes.errmes}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === match.params.dishId)}
                    commentsErrMes={this.props.comments.errmes}
                    postComment={this.props.postComment}
                    favorite={favorite}
                    postFavorite={this.props.postFavorite}
                />
            );
        };

        // Create a PrivateRoute component which disables access to the component for unauthorized users
        const PrivateRoute = ({ component: Component, ...rest }) => {
            return (
                <Route
                    {...rest}
                    render={(props) =>
                        this.props.auth.isAuthenticated ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
                        )
                    }
                />
            );
        };

        return (
            <div>
                <Header auth={this.props.auth} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser} />

                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames='page' timeout={300}>
                        {/* Switch the components bases on the routes defined */}
                        <Switch>
                            {/* Render the home component if route matches to /home */}
                            <Route path='/home' component={HomePage} />

                            {/* Render the menu component if route exactly matches to /menu */}
                            {/* To pass props with the component, needs to be defined like below */}
                            <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                            <Route path='/menu/:dishId' component={DishWithId} />
                            <PrivateRoute
                                exact
                                path='/favorites'
                                component={() => <Favorites favorites={this.props.favorites} deleteFavorite={this.props.deleteFavorite} />}
                            />
                            <Route
                                exact
                                path='/contactus'
                                component={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm} />}
                            />
                            <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />

                            {/* Use redirect to specify a default route if routes does not match any above routes */}
                            <Redirect to='/home' />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>

                <Footer />
            </div>
        );
    }
}

//Connect Main component to redux store by wrapping Main inside a connect function from react-redux
//Surround the connect function with withRouter from react-router to make use of react router
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Main)
);
