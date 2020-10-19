import React from 'react';
import './App.css';
//import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Login from "./components/Login"
import Signin from "./components/Signin"


class App extends React.Component {
  render() {
    return (
      <div className="App container p-5">
        <Login />
        <Signin />
        {/*<Router>
          <Switch>
            <Route exact path="/signin" component={Signin}>Sing in</Route>
            <Route exact path="/login" component={Login}>Login</Route>
          </Switch>
        </Router>*/}
      </div>
    )
  }
}

export default App;
