import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal'
import Logout from './Logout'

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap'


const AppNavbar = ({ isAuthenticated, user }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
                <NavbarBrand href="/">ShoppingList</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        {!isAuthenticated && (
                            <Fragment>
                                <NavItem>
                                    <RegisterModal />
                                </NavItem>
                                <NavItem>
                                    <LoginModal />
                                </NavItem>
                            </Fragment>
                        )}
                        {isAuthenticated && (
                            <Fragment>
                                {user && (<NavItem>
                                    <span className="navbar-text mr-3">
                                        <strong>Welcome {user.username}</strong>
                                    </span>
                                </NavItem>)}
                                <NavItem>
                                    <Logout />
                                </NavItem>
                            </Fragment>
                        )}
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    </div>
}

AppNavbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps)(AppNavbar)