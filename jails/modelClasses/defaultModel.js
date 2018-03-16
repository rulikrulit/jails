class Chat {
  defaultProps() {
    return {
      messages: []
    };
  }
  get props() {
    return this.properties;
  }

  addMessage(params) {
    this.properties.messages.push({
      user: params.user,
      message: params.message
    });
  }

  costructor(props) {
    this.properties = props || this.defaultProps();
  }
}

module.exports = Chat;

module.exports = {
  methods: {},
  properties: {},
  instanceProperties: {
    messages: []
  },
  instanceMethods: function(self) {
    return {
      addMessage: function(params) {
        self.properties.messages.push({
          user: params.user,
          message: params.message
        });
      }
    };
  }
}
