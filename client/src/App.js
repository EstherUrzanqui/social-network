import React, { useEffect, useState } from "react";
import './App.css';
import Login from "./components/Login"
import Signin from "./components/Signin"
import Feed from "./components/Feed"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"


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
      <Router>
        <Switch>
          <Route path='/login'component={Login}></Route>
          <Route path="/signin" component={Signin}></Route> 
          <Route path="/feed" component={Feed}></Route>        
        </Switch>
      </Router>
    </div>
  ) 
}

export default App;
