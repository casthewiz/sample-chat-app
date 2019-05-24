import React, {Component} from 'react';
import {Container, Row, Panel, Button, Col, ListGroup, ListGroupItem} from 'react-bootstrap';
import Gun from 'gun';
import _ from 'lodash';

class Home extends Component {
  constructor({gun}) {
    super()
    this.gun = gun;
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={4} >
            <h4>Conversations go Here</h4>
          </Col>
          <Col sm={8}>
            <h4>Messages Go Here</h4>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
