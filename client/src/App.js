import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import { Button } from "reactstrap"
import Login from "./components/Login"
import Signin from "./components/Signin"
import Singin from './components/Signin';


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
