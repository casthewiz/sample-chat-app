import React, {Component} from 'react';
import {Form, Card, Button, Col, Row, ButtonGroup, } from 'react-bootstrap';
import Gun from 'gun';
import _ from 'lodash';
import nanoid from 'nanoid';
import MessageView from '../chat/message-view.js'
import {users} from '../auth/test-users.js'

const newConversation = () => {return {id: '', title: ''}};

class ConversationList extends Component {
  constructor({conversationClick}) {
    super()
    this.conversationClick = conversationClick
  }

  getConvoItem(conversation) {
    return (<Button
      variant="outline-dark"
      key={conversation.id}
      id={conversation.id}
      name={conversation.title}
      style={{whiteSpace:'normal',height:'3.6em', overflow:'hidden'}}
      onClick={this.conversationClick}
      block>
      {conversation.title}
    </Button>)
  }

  render() {
    return(
      <Col sm={12} className="justify-content-md-center text-center">
        <Card.Title className="mb-3">
          <h3> Active Chats </h3>
        </Card.Title>
        <Row>
        <ButtonGroup className="col-sm-12" vertical>
          {this.props.conversations.map(this.getConvoItem.bind(this))}
        </ButtonGroup>
        </Row>
      </Col>
    )
  }
}

//lots of logic in this class that needs split out
//Creating conversation should be its own concern
class ConversationView extends Component {
  constructor({gun}) {
    super()
    this.gun = gun;
    this.notesRef = gun.get('notes');
    this.state = {
      conversations: [],
      conversationIdSet: new Set(),
      conversationId: '',
      conversationName: '',
      selectedUserPubs: [],
    };
  }

  componentDidMount() {
    this.fetchConversations()
  }

  componentDidUpdate(prevProps){
    if (prevProps.pub != this.props.pub) this.fetchConversations()
  }

  fetchConversations(){
    let conversations = [];
    let conversationIdSet = new Set();
    this.setState({conversations, conversationIdSet})
    //retrieve a user's conversations
    //extra map checks for garbage data due to testing
    this.gun.get('conversations')
    .map((conversation) => {
      if (conversation[this.props.pub] != undefined
        && conversation.id != ''
        && conversation[0] == undefined
        && conversation.title
        && conversation.title != ''){
        return conversation;
      }
    })
    .on((conversation) => {
      //Quick set logic just to check if we already have a conversation
      //This block needs changed if we wanted to add settings or configgable
      //conversations. Same for adding/removing users from conversation
      if (!conversationIdSet.has(conversation.id)){
        conversations = conversations.concat(conversation);
        conversationIdSet.add(conversation.id)
      }
      this.setState({conversations, conversationIdSet});
    })
  }

  createConversation(){
    const conversation = newConversation();
    conversation[this.props.pub] = this.props.name
    for (let user of this.state.selectedUserPubs) {
      conversation[user.pub] = user.name
      conversation.title += ` ${user.name},`
    }
    conversation.title = conversation.title.trim()
    conversation.title = conversation.title.slice(0,-1)
    //Gun automagically creates new empty conv. node if it can't find
    //'conversations'. Will reconcile if there's connection issues as well
    //But it needs a uuid for a new conv. node
    const convId = nanoid()
    conversation.id = convId
    this.gun.get('conversations').put({[convId]:conversation})
  }


  conversationClick (event) {
    console.log(event.target)
    this.setState({
      conversationId: event.target.id,
      conversationName: event.target.name,
    });
  }

  resetConversation() {
    this.setState({conversationId: ''})
  }

  handleUserSelect(event) {
    const toggledUser = {pub:event.target.value, name:event.target.id}
    let pubArray = this.state.selectedUserPubs
    if (event.target.checked) {
      pubArray = [...this.state.selectedUserPubs, toggledUser]
    } else {
      pubArray = this.state.selectedUserPubs.filter(user => user.pub != event.target.value)
    }
    this.setState({selectedUserPubs: pubArray})
  }

  render() {

    const userList = Object.keys(users).map((user) => {
      const pubFromList = users[user].pub
      return (
        <Form.Check
          type="checkbox"
          label={user}
          key={pubFromList}
          value={pubFromList}
          id={user}
          onChange={this.handleUserSelect.bind(this)}
        />
      )
    })

    return (
        <Row className="justify-content-md-center">
          {
            this.state.conversationId == '' &&
            <Col sm={12} md={10} lg={8}>
              <Card style={{minHeight: '300px'}}>
                <Card.Body>
                  {this.state.conversations.length == 0 &&
                     <Card.Title className="mb-3">
                      <h3> No Conversations Started </h3>
                     </Card.Title>
                  }
                  {this.state.conversations.length > 0 &&
                    <ConversationList
                      conversations = {this.state.conversations}
                      conversationClick = {this.conversationClick.bind(this)}
                    />
                  }
                </Card.Body>
                <Card.Footer>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Pick Users</Form.Label>
                    {userList}
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={this.createConversation.bind(this)}
                    disabled={this.state.selectedUserPubs.length == 0}
                    block>
                      New Chat
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          }
          {
            this.state.conversationId != '' &&
            <MessageView
            gun={this.gun}
            conversationId={this.state.conversationId}
            conversationName={this.state.conversationName}
            resetConversation={this.resetConversation.bind(this)}
            activeUser={this.props.name}
            />
          }
        </Row>
    );
  }
}

export default ConversationView;
