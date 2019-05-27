import React, { Component } from 'react';
import Gun from 'gun';
import Interface from './interface';
import AppNavbar from './nav';
import {UserProvider} from './auth/user-context'


class App extends Component {
  constructor() {
    super();
    this.gun = Gun(location.origin + '/gun');

    this.state = { userPub: 0, userName:'', };
  }

  setUserPub = (pub) => {
    console.log(pub)
    this.setState({
      userPub: pub
    })
  }

  setUserName = (name) => {
    console.log(name)
    this.setState({
      userName: name
    })
  }

  render() {
    return (
      <div>
        <UserProvider value ={{
          setUserPub: this.setUserPub,
          setUserName: this.setUserName,
        }}>
          <AppNavbar gun={this.gun} />
          <Interface gun={this.gun} pub={this.state.userPub} user={this.state.userName} />
        </UserProvider>
      </div>
    );
  }
}

export default App;
