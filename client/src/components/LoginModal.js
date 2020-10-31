import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { signin } from '../actions/authActions'
import { clearErrors } from '../actions/errorActions'
import PropTypes from 'prop-types'
import {
    Button,
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    FormText
} from 'reactstrap'


class LoginModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        isPasswordVisible: false,
        msg: null
    }

    static propTypes = {
        // Router
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // Other
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        signin: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate (prevProps) {
        const { error, isAuthenticated } = this.props
        // Check for login fail errors 
        if (prevProps.error !== error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.error || error.msg.msg })
            } else {
                this.setState({ msg: null })
            }
        }

        // Close modal when authenticated
        if (this.state.modal) { // modal is open
            if (isAuthenticated) {
                this.toggle()
            }
        }
    }

    toggle = () => {
        this.props.clearErrors()
        this.setState({
            modal: !this.state.modal
        })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()
        const { email, password } = this.state

        // Sign in with email & password
        this.props.signin({ email, password }, this.props.history)
    }

    render () {
        const {
            msg,
            isPasswordVisible,
            email,
            password
        } = this.state
        const {
            isAuthenticated,
            isLoading,
            error,
            clearErrors
        } = this.props

        return (
            <div>
                <NavLink onClick={this.toggle} href="#">
                    Login
                </NavLink>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="item">Email</Label>
                                <Input
                                    className="mb-3"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={this.handleChange}
                                />
                                <Label for="item">Password</Label>
                                <div style={{ position: 'relative' }}>
                                    <Input
                                        className="mb-3"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={this.handleChange}
                                    />
                                    <Button
                                        color="dark"
                                        style={{ position: 'absolute', top: 0, height: '100%', right: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                        onClick={e => { e.preventDefault(); this.setState({ isPasswordVisible: !isPasswordVisible })}}
                                    >
                                        { isPasswordVisible ? 'Hide' : 'Show' }
                                    </Button>
                                </div>
                                
                                <Button color="dark" style={{ marginTop: '2rem' }} block>
                                    {isLoading ? '...' : 'Login'}
                                </Button>
                                { msg && <FormText color="danger">{msg}</FormText>}
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.error
})

export default connect(
    mapStateToProps,
    dispatch => ({
        signin: (user, history) => {
            dispatch(signin(user, history))
        },
        clearErrors: () => dispatch(clearErrors())
    })
)(withRouter(LoginModal))