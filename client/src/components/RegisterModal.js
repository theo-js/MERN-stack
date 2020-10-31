import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
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
import { connect } from 'react-redux'
import { register } from '../actions/authActions'
import { clearErrors } from '../actions/errorActions'
import PropTypes from 'prop-types'


class RegisterModal extends Component {
    state = {
        modal: false,
        username: '',
        email: '',
        age: 18,
        password: '',
        confirmation: '',
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
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate (prevProps) {
        const { error, isAuthenticated } = this.props
        // Check for register fail errors 
        if (prevProps.error !== error) {
            if (error.id === 'REGISTER_FAIL') {
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

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()
        const { username, email, age, password, confirmation } = this.state

        // Register with form data
        this.props.register({ username, email, age, password, confirmation }, this.props.history)
    }

    render () {
        const {
            msg,
            isPasswordVisible,
            username,
            email,
            age,
            password,
            confirmation
        } = this.state
        const {
            isAuthenticated,
            error,
            clearErrors
        } = this.props

        return (
            <div>
                <NavLink onClick={this.toggle} href="#">
                    Register
                </NavLink>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="item">Name</Label>
                                <Input
                                    className="mb-3"
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Name"
                                    value={username}
                                    onChange={this.onChange}
                                />
                                <Label for="item">Email</Label>
                                <Input
                                    className="mb-3"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={this.onChange}
                                />
                                <Label for="item">Age</Label>
                                <Input
                                    className="mb-3"
                                    type="number"
                                    name="age"
                                    id="age"
                                    placeholder="Age"
                                    value={age}
                                    min={18}
                                    max={99}
                                    onChange={this.onChange}
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
                                        onChange={this.onChange}
                                    />
                                    <Button
                                        color="dark"
                                        style={{ position: 'absolute', top: 0, height: '100%', right: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                        onClick={e => { e.preventDefault(); this.setState({ isPasswordVisible: !isPasswordVisible })}}
                                    >
                                        { isPasswordVisible ? 'Hide' : 'Show' }
                                    </Button>
                                </div>
                                <Label for="item">Confirm password</Label>
                                <Input
                                    type="password"
                                    name="confirmation"
                                    id="confirmation"
                                    placeholder="Confirmation"
                                    value={confirmation}
                                    onChange={this.onChange}
                                />
                                { msg && <FormText color="danger">{msg}</FormText>}
                                <Button color="dark" style={{ marginTop: '2rem' }} block>
                                    Register
                                </Button>
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
    error: state.error
})

export default connect(
    mapStateToProps,
    dispatch => ({
        register: (user, history) => {
            dispatch(register(user, history))
        },
        clearErrors: () => dispatch(clearErrors())
    })
)(withRouter(RegisterModal))