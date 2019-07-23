import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform } from 'react-animation-components';

//this componennt is only implemented in this component, so it is defined here
//Define as a new component file if need to be used in other components
function RenderCard({ item, isLoading, errMes }) {
    if (isLoading) {
        return <Loading />;
    } else if (errMes) {
        return <h4>{errMes}</h4>;
    } else {
        return (
            <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }}>
                <Card>
                    <CardImg src={baseUrl + item.image} alt={item.name} />
                    <CardBody>
                        <CardTitle>{item.name}</CardTitle>
                        {/* Designation exists only for leader, so render if exists */}
                        {/* null return no element */}
                        {item.designation ? <CardSubtitle>{item.designation}</CardSubtitle> : null}
                        <CardText>{item.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    }
}

function Home(props) {
    console.log(JSON.stringify(props));
    return (
        <div className='container'>
            <div className='row align-items-start'>
                <div className='col-12 col-md m-1'>
                    <RenderCard item={props.dish} isLoading={props.dishesLoading} errMes={props.dishesErrMes} />
                </div>
                <div className='col-12 col-md m-1'>
                    <RenderCard item={props.promotion} isLoading={props.promosLoading} errMes={props.promoErrMes} />
                </div>
                <div className='col-12 col-md m-1'>
                    <RenderCard item={props.leader} isLoading={props.leadersLoading} errMes={props.leadersErrMes} />
                </div>
            </div>
        </div>
    );
}

export default Home;
