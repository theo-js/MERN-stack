import React, { useLayoutEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import checkAuthState from './checkAuthState'
import Loader from '../components/Loader'

const PrivateRoute = ({ fallback, location, children, ...rest }) => {
    const tokenSelector = ({ auth }) => auth.token
    const token = useSelector(tokenSelector)
    
    const [component, setComponent] = useState(<Loader />)
    const authorize = () => setComponent(<Route {...rest}>{children}</Route>)
    const forbid = () => setComponent(<Redirect to={{ pathname: fallback, state: { from: location } }} />)

    useLayoutEffect(() => {
        checkAuthState(token)
            .then(res => {
                // Give access to component
                if (res.data.isAuthenticated) authorize()
                else forbid()
            })
            .catch(err => forbid())
    }, [])

    return component
}

PrivateRoute.defaultProps = {
    fallback: '/'
}

export default PrivateRoute