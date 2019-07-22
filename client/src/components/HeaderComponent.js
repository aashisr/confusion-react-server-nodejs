import React, { Component } from 'react';
import {
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    NavItem,
    Jumbotron,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        //Always required for a constructor
        super(props);

        //State should be defined in the constructor of a component
        //State stores properties related to a component
        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };

        // Bind toggleNav in order ot make it available to use in JSX
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleNav() {
        //Change the state of isNavOpen
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    //Function to handle login
    handleLogin(event) {
        //Close the login form modal
        this.toggleModal();
        this.props.loginUser({ username: this.username.value, password: this.password.value });
        event.preventDefault();
    }

    handleLogout() {
        this.props.logoutUser();
    }

    render() {
        return (
            //React fragments (can be used like this as well <> </>) enables to group bunch of react elements and return it
            <React.Fragment>
                <Navbar dark expand='md'>
                    <div className='container'>
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className='mr-auto' href='/'>
                            <img src='assets/images/logo.png' height='30' width='41' alt='Ristorante Con Fusion' />
                        </NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className='nav-link' to='/home'>
                                        <span className='fa fa-home fa-lg'> Home</span>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink className='nav-link' to='/menu'>
                                        <span className='fa fa-list fa-lg'> Menu</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/favorites'>
                                        <span className='fa fa-heart fa-lg' /> My Favorites
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/aboutus'>
                                        <span className='fa fa-info fa-lg'> About Us</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/contactus'>
                                        <span className='fa fa-address-card fa-lg'> Contact Us</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className='ml-auto' navbar>
                                <NavItem>
                                    {!this.props.auth.isAuthenticated ? (
                                        <Button outline onClick={this.toggleModal}>
                                            <span className='fa fa-sign-in fa-lg'>Login</span>
                                            {this.props.auth.isLoading ? <span className='fa fa-spinner fa-pulse fa-fw' /> : null}
                                        </Button>
                                    ) : (
                                        <div>
                                            <div className='navbar-text mr-3'>{this.props.auth.user.username}</div>
                                            <Button outline onClick={this.handleLogout}>
                                                <span className='fa fa-sign-out fa-lg'>Logout</span>
                                                {this.props.auth.isLoading ? <span className='fa fa-spinner fa-pulse fa-fw' /> : null}
                                            </Button>
                                        </div>
                                    )}
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className='container'>
                        <div className='row row-header'>
                            <div className='col-12 col-sm-6'>
                                <h1>Ristorante ConFusion</h1>
                                <p>
                                    We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking
                                    creations will tickle your culinary senses!
                                </p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        {/* An uncontrolled react form */}
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor='username'>Username</Label>
                                <Input type='text' id='username' name='username' innerRef={(input) => (this.username = input)} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor='password'>Password</Label>
                                <Input type='password' id='password' name='password' innerRef={(input) => (this.password = input)} />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type='checkbox' name='remember' innerRef={(input) => (this.remember = input)} />
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type='submit' value='submit' color='primary'>
                                Login
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Header;
