import React, { useState, useEffect } from "react";
import './App.css';
import Login from "./components/Login"
import Signin from "./components/Signin"
import Feed from "./components/Feed"
import Navbar from "./components/Navbar"
import Profile from "./components/Profile"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Followers from "./components/Followers";


const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)
    console.log(isLoggedIn)

    useEffect(() => {
      if (localStorage.getItem("token")) {
        setLoggedIn(true);
      }
    }, []);
  
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
          <Route exact path="/signin" component={Signin}></Route> 
          <Route exact path="/feed" component={Feed}></Route> 
          <Route exact path="/profile" component={Profile}></Route>
          <Route exact path="/followers" component={Followers}></Route>      
        </Switch>
      </Router>
    </div>
  ) 
}

export default App;
