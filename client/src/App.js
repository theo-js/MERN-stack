import React from 'react'
import AppNavbar from './components/AppNavbar'
import ItemModal from './components/ItemModal'
import ShoppingList from './components/ShoppingList'
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header>
          <AppNavbar />
        </header>
        <main>
          <ItemModal />
          <ShoppingList />
        </main>
      </div>
    </Provider>
  );
}

export default App;