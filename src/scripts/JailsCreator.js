let indexPromise, jail;

class JailsCreator {
  get jail() {
    return jail;
  }
  get indexPromise() {
    return indexPromise;
  }
  constructor(config) {
    if (!jail) {
      jail = window.Jails({
        debug: true
      });
      indexPromise = new Promise(function(resolve, reject) {
        jail.on('getIndex', function() {
          resolve();
        });
      });
      jail.getIndex();
    }
  }
}

export default JailsCreator;