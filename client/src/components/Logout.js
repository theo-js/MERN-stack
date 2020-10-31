import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { NavLink } from 'reactstrap'
import { connect} from 'react-redux'
import { logout } from '../actions/authActions'
import PropTypes from 'prop-types'

const Logout = ({ logout, history, location, match }) => {
    return <Fragment>
        <NavLink onClick={() => logout(history)} href="#">
            Logout
        </NavLink>
    </Fragment>
}

Logout.propTypes = {
     // Router
     match: PropTypes.object.isRequired,
     location: PropTypes.object.isRequired,
     history: PropTypes.object.isRequired,
     // Other
    logout: PropTypes.func.isRequired
}

const mapStateToProps = null

export default connect(
    mapStateToProps,
    dispatch => ({
        logout: history => dispatch(logout(history))
    })
)(withRouter(Logout))