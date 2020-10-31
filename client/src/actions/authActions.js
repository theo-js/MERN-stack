import axios from 'axios'
import { returnErrors, clearErrors } from './errorActions'
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT_SUCCESS
} from './types'

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING })

    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({ type: USER_LOADED, payload: res.data }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({ type: AUTH_ERROR })
        })
}

// Login
export const signin = ({ email, password }, history) => dispatch => {
    dispatch(clearErrors())
    dispatch({ type: USER_LOADING })
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Body
    const body = JSON.stringify({ email, password })
    
    axios.post('/api/auth', body, config)
        .then(res => {
            dispatch({ type: LOGIN_SUCCESS, payload: res.data })
            history.push('/dashboard')
        })
        .catch(err => {
            dispatch({ type: LOGIN_FAIL })
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
        })
}

// Register user
export const register = ({ username, email, age, password, confirmation }, history) => (dispatch, getState) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Body
    const body = JSON.stringify({ username, email, age, password, confirmation })

    axios.post('/api/users/register', body, config)
        .then(res => {
            dispatch({ type: REGISTER_SUCCESS, payload: res.data.user })
            history.replace('/dashboard')
        })
        .catch(err => {
            dispatch({ type: REGISTER_FAIL })
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
        })
}

// Log out user
export const logout = history => dispatch => {
    dispatch({ type: LOGOUT_SUCCESS })
    history.replace('/')
}

export function tokenConfig (getState) {
    // Get token from localstorage
    const token = getState().auth.token

    // Headers
    const config = {
        headers: {
            "Content-Type": "Application/json",
        }
    }
    // If token, add to headers
    if (token) config.headers['x-auth-token'] = token

    return config
}