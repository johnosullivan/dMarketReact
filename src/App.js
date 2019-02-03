import React, { Component } from 'react';
import Header from './Header';
import Body from './Body';
import './App.css';
import Service from './UserService';

class App extends Component {

  constructor() {
    super();

    const s = new Service();
    console.log(s);
    console.log(window.ethereum);

    window.ethereum.enable();
  }

  render() {
    return (
      <div className="App">
        <Header store={this.props.store}/>
        <Body store={this.props.store}/>
      </div>
    );
  }
}

export default App;
