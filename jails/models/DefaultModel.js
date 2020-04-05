// Sample model with basic default methods.
// Didn't figure out how to configure it to use as a base class because FE requires imports and BE requires

class DefaultModel {
  static defaultProps = {}
  static publicMethods = []

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

module.exports = DefaultModel;