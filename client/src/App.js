// Libs
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './router/PrivateRoute'
import RestrictedRoute from './router/RestrictedRoute'

// Components
import AppNavbar from './components/AppNavbar'
import ItemModal from './components/ItemModal'
import ShoppingList from './components/ShoppingList'

// Styles
import './bootstrap.min.css'
import './App.css';

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions'

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header>
            <AppNavbar />
          </header>
          <main className="container">
            <Switch>
              <RestrictedRoute exact path="/">
                <h2>Welcome</h2>
              </RestrictedRoute>
              <PrivateRoute path="/dashboard">
                <ItemModal />
                <ShoppingList />
              </PrivateRoute>
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  )
}

export default App;