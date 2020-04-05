import React, { Component } from 'react';
import JailsCreator from './scripts/JailsCreator.js';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: '',
      user: 'Russ'
    };
  }

  handleChange(event) {
    this.setState({currentMessage: event.target.value});
  }

  handleUserChange(event) {
    this.setState({user: event.target.value});
  }

  handleSubmit(event) {
    this.chat.methods.addMessage({
      message: this.state.currentMessage,
      user: this.state.user
    });
    this.setState({currentMessage: ''});
    event.preventDefault();
  }

  setChat() {
    let self = this;
    console.log('setting chat');
    var Chat = this.jail.loadModel('Chat');
    Chat.on('create', function(chat) {
      console.log('chat create');
      setChat(chat);
    });
    Chat.on('getModel', function(chat) {
      console.log('getting chat', chat);
      if (chat.id === 0) { // chat id hardcoded
        setChat(chat);
      } else {
        Chat.methods.create({
          messages: []
        });
      }
    });
    function setChat(chat) {
      self.chat = chat;
      self.setState({messages: chat.properties.messages});
      chat.on('addMessage', function(params) {
        console.log('Got message!', params, chat);
        self.setState({messages: chat.properties.messages});
      });

    }

    Chat.methods.getModel({id: 0}); // chat id hardcoded
  }

  componentDidMount() {
    let self = this;
    let jailsCreator = new JailsCreator();
    this.jail = jailsCreator.jail;
    jailsCreator.indexPromise.then(() => {
      self.setChat();
    });
  }

  render() {
    const messages = this.state.messages.map((message, i) => (
      <div key={i}><strong>{message.user}:</strong> <span>{message.message}</span></div>
    ));
    return (
      <div className="chat">
        <h1>CHAT!</h1>
        {messages}
        <input type="text" value={this.state.user} onChange={this.handleUserChange.bind(this)} />
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label>
            Message:
            <textarea type="text" value={this.state.currentMessage} onChange={this.handleChange.bind(this)}></textarea>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Chat;
