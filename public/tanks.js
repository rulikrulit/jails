(function() {

  function renderBoard(tanks) {
    console.log('rendering', tanks.properties);
  }

  function setEvents(Tanks, tanks) {
    tanks.on('reset', function(params, data) {
      createBoardHtml(data);
    });
    tanks.on('move', function(params) {
      renderBoard(tanks);
    });
    tanks.on('add', function(params) {
      renderBoard(tanks);
    });
    document.getElementById('reset-button').addEventListener('click', tanks.methods.reset);
    document.getElementById('join').addEventListener('click', function() {
      let name = document.getElementById('name').value;
      localStorage.setItem('name', name);
      tanks.methods.add({name: name, type: 'players'});
    });

  }

  let jailsCreator = new JailsCreator();
  let jail = jailsCreator.jail;
  jailsCreator.indexPromise.then(() => {
    const Tanks = jail.loadModel('TANKS');
    Tanks.on('create', function(tanks) {
      console.log('tanks create', tanks);
      Tanks.methods.getModel({id: 0});
    });

    Tanks.on('getModel', function(tanks) {
      console.log('getting tanks', tanks);
      if (tanks.id === 0) {
        console.log('tanks.id 0');
        setEvents(Tanks, tanks);
        renderBoard(tanks);
      } else {
        Tanks.methods.create();
      }
    });


    Tanks.methods.getModel({id: 0});
  });
})();



