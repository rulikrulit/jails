module.exports = {
  name: 'Runner',
  description: 'Dummy runner for the game that will use AI in future',
  init: function(jails) {
    console.log('BOT INITED!', jails);
  },
  get: function(msg) {
    console.log('bot recieved', msg);
  }
}