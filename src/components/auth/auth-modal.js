import React, {Component} from 'react';
import {Modal,Button, Col, Container} from 'react-bootstrap';
import Gun from 'gun';
import {UserContext,UserConsumer} from './user-context'
import {users} from './test-users.js'

class AuthModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleOpen() {
    this.setState({ show: true });
  }

  //pub represents user key - in Gun auth, it would be a pubkey
  //associated to the Gun user
  //we use the App level setUserPub function to track active user
  render() {
    const userList = Object.keys(users).map((user) => {
      const pub = users[user].pub
      return (
        <UserConsumer key={pub}>
          {({setUserPub, setUserName}) => (
            <Button variant="primary"
                    size="lg"
                    block
                    onClick={() => {
                        setUserPub(pub)
                        setUserName(user)
                        this.handleClose()}
                    }
            >
              {user}
            </Button>
          )}
        </UserConsumer>
      )
    })
    return (
        <div>
            <Button variant="primary" onClick={this.handleOpen}>Pick User</Button>
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Pick a User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  {userList}
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    );
  }
}

export default AuthModal;
