import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

//Functions required for form-validation
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    //Function to toggle 'Submit Comment' modal
    toggleModal() {
        //Set the isModalOpen to true or false
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleCommentSubmit(values) {
        console.log('Submit comment ' + JSON.stringify(values));
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return (
            //React fragments (can be used like this as well <> </>) enables to group bunch of react elements and return it
            <React.Fragment>
                {/* Button to toggle form modal */}
                <Button outline onClick={this.toggleModal} className='col-6'>
                    <span className='fa fa-pencil fa-lg'>Submit Comment</span>
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleCommentSubmit(values)}>
                            <Row className='form-group'>
                                <Col xs={12}>
                                    <Label htmlFor='rating'>Rating</Label>
                                </Col>
                                <Col xs={12}>
                                    <Control.select model='.rating' name='rating' className='form-control'>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col xs={12}>
                                    <Label htmlFor='author'>Your Name</Label>
                                </Col>
                                <Col xs={12}>
                                    <Control.text
                                        model='.author'
                                        id='author'
                                        name='author'
                                        placeholder='Your Name'
                                        className='form-control'
                                        validators={{
                                            minLength: minLength(3),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className='text-danger'
                                        model='.name'
                                        show='touched'
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col xs={12}>
                                    <Label htmlFor='name'>Comment</Label>
                                </Col>
                                <Col xs={12}>
                                    <Control.textarea model='.comment' id='comment' name='comment' rows='6' className='form-control' />
                                </Col>
                            </Row>
                            <Row className='form-group'>
                                <Col xs={12}>
                                    <Button type='submit' color='primary'>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

export default CommentForm;
