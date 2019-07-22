import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

//Changed a presentational component to functional component since this componet works only with the props sent by
//its parent and there are no any local states or lifecycle hooks required

//dish and onClick are javaScript objects, so needs to be inside curly braces
function RenderMenuItem({ dish }) {
    return (
        // tag=li indicates these are going to be a list item
        <Card>
            {/* Parameters are passed to a link as below enclosed in BACK QUOTES */}
            <Link to={`/menu/${dish._id}`}>
                <CardImg width='100%' src={baseUrl + dish.image} alt={dish.description} />
                <CardImgOverlay>
                    <CardTitle>{dish.name}</CardTitle>
                </CardImgOverlay>
            </Link>
        </Card>
    );
}

//Same thing as above but an arrow function
//This const Menu is the component in MainComponent, props is the props passed from MainComponent
const Menu = (props) => {
    //ForEach dishes array with map function and return individual ment items as react component
    const menu = props.dishes.dishes.map((dish) => {
        return (
            //React requires a key while rendering a list of items to identify each items uniquely
            <div key={dish._id} className='col-12 col-md-5 m-1'>
                {/* RenderMenuItem component defined above which passes the dish as props */}
                <RenderMenuItem dish={dish} />
            </div>
        );
    });

    if (props.dishes.isLoading) {
        return (
            <div className='container'>
                <div className='row'>
                    <Loading />
                </div>
            </div>
        );
    } else if (props.dishes.errmes) {
        return (
            <div className='container'>
                <div className='row'>
                    <h4>{props.dishes.errmes}</h4>
                </div>
            </div>
        );
    } else {
        return (
            <div className='container'>
                <div className='row'>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/home'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Menu</BreadcrumbItem>
                    </Breadcrumb>
                    <div className='col-12'>
                        <h3>Menu</h3>
                        <hr />
                    </div>
                </div>
                <div className='row'>{menu}</div>
            </div>
        );
    }
};

//Export component from this file
//So, it can be imported in other files
export default Menu;
