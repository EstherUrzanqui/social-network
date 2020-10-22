import React, { useState } from 'react';
import './App.css';
import Login from "./components/Login"



const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false)

  const handleLogin = token => {
    if (!token) return
    localStorage.setItem('token', token)

    setLoggedIn(true)
  }

  const handleLogout = () => () => {
    setLoggedIn(false)
    localStorage.clear()
  }
  
    return (
      <div className="App">
        <Login />
      </div>
    )
  
}

export default App;
