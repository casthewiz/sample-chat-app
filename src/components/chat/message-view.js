import React, {Component} from 'react';
import {Card, Button, Col, ListGroup, ListGroupItem, InputGroup, FormControl} from 'react-bootstrap';
import Gun from 'gun';
import _ from 'lodash';
import nanoid from 'nanoid';

const messageTemplate = () => {return {id:'',conversationId: '', sender: '', text:'', time:''} };

//shamelessly built off of https://stackoverflow.com/a/6313032
//formats datetime into a string for our messages
const dateHelper = (epochStamp) => {
  const date = new Date(epochStamp)

  let a = 'AM'
  let hh = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  if (hh > 12) {
    hh = hh % 12;
    a = 'PM'
  }
  if (mm < 10) {mm = "0"+mm;}
  if (ss < 10) {ss = "0"+ss;}
  return hh+':'+mm+':'+ss+' '+a;
}

//lots of logic to split out here
//individual message display might be component worthy
//also the message list display should be its own component
//message creation should be its own concern as well
class MessageView extends Component {
  constructor({gun, conversationId, conversationName, resetConversation}) {
    super()
    this.gun = gun;
    this.conversationId = conversationId;
    this.conversationName = conversationName;
    this.resetConversation = resetConversation;
    this.newMessageField = {}
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    const messages = this.state.messages;
    const self = this;
    //retrieve messages
    this.fetchMessages()
  }

  fetchMessages(){
    let messages = [];
    //retrieve a message's messages
    this.gun.get('conversations')
    .get(this.conversationId)
    .map((prop) => {
      if (prop.conversationId) return prop
    })
    .once((message) => {
      messages = messages.concat(message);
      //Sort our messages by timestamp
      //Poor solution, but not a big deal until 10^3 messages in
      //a conversation, shouldn't be loading that much into dom anyways
      messages.sort((left, right) => left.time - right.time)

      this.setState({messages});

      //Hacky autoscrolling on new object
      const chatwindow = document.getElementById("messageContainer")
      chatwindow.scrollIntoView(false)
    })
  }

  messageBodyChange(event) {
    this.setState( {newMessageBody: event.target.value} )
  }

  sendMessage(){
    if (!this.newMessageField.value.length > 0) return;
    const newMessage = messageTemplate()
    newMessage.text = this.newMessageField.value
    newMessage.sender = this.props.activeUser
    newMessage.time = Date.now()
    newMessage.conversationId = this.conversationId

    const messageId = nanoid()
    newMessage.id = `message_${messageId}`
    console.log(newMessage)

    this.gun.get('conversations').get(this.conversationId).put({
      [newMessage.id]:newMessage
    })
    this.newMessageField.value = ''
  }

  formatMessage(messageObj) {
    return(
      <div className='mb-2' key={messageObj.id}>
        <div className='font-weight-light' style={{fontSize:'14px'}}>
          {messageObj.sender}
        </div>
        <div style={{fontSize:'18px'}}>{messageObj.text}</div>
        <div className='font-weight-light' style={{fontSize:'14px'}}>
          {dateHelper(messageObj.time)}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Col sm={12} md={10} lg={8}>
        <Card style={{minHeight: '300px'}}>
          <Card.Header>
            <Button onClick={this.resetConversation}>
              Back
            </Button>
            <span style={{paddingLeft:'10px'}}>
              {this.conversationName}
            </span>
          </Card.Header>
          <Card.Body style={{maxHeight:'400px', overflowY:'auto'}}>
            { this.state.messages.length > 0 &&
              <ListGroup id='messageContainer'>
                {this.state.messages.map(message => this.formatMessage(message))}
              </ListGroup>
            }
          </Card.Body>
          <Card.Footer>
          <InputGroup>
            <FormControl
              placeholder="Message"
              aria-label="Message"
              ref={el => this.newMessageField = el}
              onChange={ (e) => this.messageBodyChange(e) }
              onKeyPress={event => { if (event.key == "Enter") this.sendMessage() } }
            />
            <InputGroup.Append>
              <Button variant="primary"
              disabled={!this.newMessageField.value || this.newMessageField.value.length == 0}
              onClick={this.sendMessage.bind(this)}>Send</Button>
            </InputGroup.Append>
            </InputGroup>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}

export default MessageView;
