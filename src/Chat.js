import React, { Component } from 'react';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  setChat() {
    console.log('setting chat');
    var Chat = this.jail.loadModel('CHAT');
    Chat.on('create', function(chat) {
      console.log('chat create');
      setChat(chat);
    });
    Chat.on('getModel', function(chat) {
      console.log('getting chat', chat);
      if (chat.id === 1) {
        setChat(chat);
      } else {
        Chat.methods.create({
          messages: []
        });
      }
    });
    function setChat(chat) {
      console.log('creating chat', chat);
      chat.properties.messages.forEach(function(params) {
        console.log('loading chat', params);
      });
      chat.methods.addMessage({
        message: 'My first message',
        user: 'RUSS'
      });
      chat.on('addMessage', function(params) {
        console.log('Got message!', params)
      });

    }

    Chat.methods.getModel({id: 1});
  }

  componentDidMount() {
    this.jail = window.Jails({
      debug: true
    });
    this.jail.on('getIndex', function() {
      console.log('received index');
    });
    console.log('getting index');
    this.jail.getIndex();
  }

  render() {
    return (
      <div className="chat">
        <h1>CHAT!</h1>
      </div>
    );
  }
}

export default Chat;
