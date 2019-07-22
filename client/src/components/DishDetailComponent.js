import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, CardImgOverlay, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import CommentForm from './CommentFormComponent';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

//Functional component

//User defined components always start with capital letters
function RenderDish({ dish, favorite, postFavorite }) {
    return (
        <div key={dish._id} className='col-12 col-md-5 m-1'>
            <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }}>
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name} width='100%' />
                    <CardImgOverlay>
                        <Button outline color='primary' onClick={() => (favorite ? console.log('Already favorite') : postFavorite(dish._id))}>
                            {favorite ? <span className='fa fa-heart' /> : <span className='fa fa-heart-o' />}
                        </Button>
                    </CardImgOverlay>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({ comments, postComment, dishId }) {
    if (comments) {
        return (
            <div className='col-12 col-md-5 m-1'>
                <Card className='p-1'>
                    <h4>Comments</h4>
                    <ul className='list-unstyled'>
                        <Stagger in>
                            {comments.map((comment) => {
                                return (
                                    <Fade in key={comment._id}>
                                        <li>{comment.comment}</li>
                                        <li>
                                            -- {comment.author}, &nbsp;
                                            {new Intl.DateTimeFormat('en-FI', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit'
                                            }).format(new Date(comment.date))}
                                        </li>
                                    </Fade>
                                );
                            })}
                        </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment} />
                </Card>
            </div>
        );
    } else {
        return <div />;
    }
}

const DishDetail = (props) => {
    if (props.isLoading) {
        return (
            <div className='container'>
                <div className='row'>
                    <Loading />
                </div>
            </div>
        );
    } else if (props.errMes) {
        return (
            <div className='container'>
                <div className='row'>
                    <h4>{props.errMes}</h4>>
                </div>
            </div>
        );
    }

    if (props.dish) {
        return (
            <div className='container'>
                <div className='row'>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/home'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link to='/menu'>Menu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className='col-12'>
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className='row'>
                    <RenderDish dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} />
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish._id} />
                </div>
            </div>
        );
    } else {
        //Return empty div
        return (
            <div className='container'>
                <h4>No favorites found!!</h4>
            </div>
        );
    }
};

export default DishDetail;
