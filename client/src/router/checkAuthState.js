import React from 'react'
import axios from 'axios'

// Check auth state
export default async function checkAuthState (token) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // If token, add to headers
    if (token) config.headers['x-auth-token'] = token

    const res = await axios.get('/api/auth/state', config)
    return res
}