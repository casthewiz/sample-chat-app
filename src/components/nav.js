import React, {Component} from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import Gun from 'gun';
import AuthModal from './auth/auth-modal'

class AppNavbar extends Component {
  constructor({gun}) {
    super()
    this.gun = gun;
    this.openAuth = this.openAuth.bind(this)
  }

  componentWillMount() {
    const self = this;
  }

  openAuth() {
    this.setState({showAuth: true})
  }

  render() {
    return (
      <Container>
        <Navbar>
          <Navbar.Brand>
            {'Sample Chat'}
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link>
              <AuthModal />
            </Nav.Link>
          </Nav>
        </Navbar>
      </Container>
    );
  }
}

export default AppNavbar;
