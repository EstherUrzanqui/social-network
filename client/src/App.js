import React from 'react';
import './App.css';
import Login from "./components/Login"


class App extends React.Component {
  render() {
    return (
      <div className="App container p-5">
        <Login />
      </div>
    )
  }
}

export default App;
