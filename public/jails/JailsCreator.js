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
      if (!window.Jails) {
        console.error('JAILS library was not loaded!');
        return false;
      }
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