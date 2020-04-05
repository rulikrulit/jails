/* SAMPLE MODEL
* Should have following properties:
* methods - additional model methods
* properties - global model properties
* instanceMethods - methods for each modal instance
* instanceProperties - default instance properties
*
*/
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