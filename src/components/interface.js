import React, {Component} from 'react';
import {Container, Row, Panel, Button, Col, ListGroup, ListGroupItem} from 'react-bootstrap';
import Gun from 'gun';
import ConversationView from './conversations/conversation-view'

class Interface extends Component {
  constructor({gun}) {
    super()
    this.gun = gun;
  }

  componentWillMount() {
    const self = this;
  }

  render() {
    return (
      <Container>
          <ConversationView gun={this.gun} name={this.props.user} pub={this.props.pub}/>
      </Container>
    );
  }
}

export default Interface;
