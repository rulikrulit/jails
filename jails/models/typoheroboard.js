/* SAMPLE MODEL
* Should have following properties:
* methods - additional model methods
* properties - global model properties
* instanceMethods - methods for each modal instance
* instanceProperties - default instance properties
*
*/
'use strict';
module.exports = {
  methods: {},
  properties: {},
  instanceProperties: { // default props don't work...
    botId: 0,
    heroId: 1
  },
  instanceMethods: function(self) {
    return {
      setDependencies: function(params) {
        self.properties.botId = params.botId;
        self.properties.heroId = params.heroId;
      }
    };
  }
}