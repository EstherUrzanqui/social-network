import React, { useState, useEffect } from "react";
import './App.css';
import Login from "./components/Login"
import Signin from "./components/Signin"
import Feed from "./components/Feed"
import Withuser from "./components/Withuser"
import Navbar from "./components/Navbar"
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
        <Navbar isLoggedIn={isLoggedIn} logout={handleLogout} />
        <Switch>
          <Route 
            exact path='/'
            component={props => (
              <Login {...props} onLogin={handleLogin} />
            )}></Route>
          <Route path="/signin" component={Signin}></Route> 
          <Route path="/feed" component={Feed}></Route> 
          <Route path="/withuser" component={Withuser}></Route>  
          <Route path="/navbar" component={Navbar}></Route>     
        </Switch>
      </Router>
    </div>
  ) 
}

export default App;
