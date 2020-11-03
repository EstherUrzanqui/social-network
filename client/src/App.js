import React from "react";
import './App.css';
import Login from "./components/Login"
import Signin from "./components/Signin"
import Feed from "./components/Feed"
import Withuser from "./components/Withuser"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"


const App = () => {
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/login'component={Login}></Route>
          <Route path="/signin" component={Signin}></Route> 
          <Route path="/feed" component={Feed}></Route> 
          <Route path="/withuser" component={Withuser}></Route>       
        </Switch>
      </Router>
    </div>
  ) 
}

export default App;
