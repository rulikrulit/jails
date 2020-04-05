class Chat {
  static defaultProps = {
    messages: []
  }
  static publicMethods = ['addMessage']

  addMessage(params) {
    this.props.messages.push({
      user: params.user,
      message: params.message
    });
  }


  // Altering this part may effect the app core.
  // Don't modify anything here unless you know what you are doing
  get props() {
    return this._props;
  }

  constructor(props) {
    props = props || {};

    // this.constructor.defaultProps - stays for any kind of defaultProps override
    const combinedProps = Object.assign(props, this.constructor.defaultProps);

    // convert to JSON and back to ensure data is convertable and to do a deep clone
    try {
      this._props = JSON.parse(JSON.stringify(combinedProps));
    } catch {
      console.error(`Couldn't convert defaultProps ${this.constructor.name} of to JSON`);
    }
  }

}

module.exports = Chat;