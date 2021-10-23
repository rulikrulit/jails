(function() {

  let myTankName = localStorage.getItem('name');

  function renderTank(tank) {
    const type = tank.type;
    let tankElement = document.getElementById(type + tank.name);

    if (!tankElement) {
      field.innerHTML += `<div id="${type}${tank.name}" class="tank tank--${type}">${tank.name}</div>`;
      tankElement = document.getElementById(type + tank.name);
    }
    if (tank.speed > 2) {
      tankElement.classList.add('tank--fast');
    }

    tankElement.style.left = tank.position[0] + 'px';
    tankElement.style.top = tank.position[1] + 'px';
  }

  function renderBullet(bullet) {
    let bulletElement = document.getElementById('bullet' + bullet.name);

    if (!bulletElement) {
      field.innerHTML += `<div id="bullet${tank.name}" class="bullet">${bullet.name}</div>`;
      bulletElement = document.getElementById('bullet' + bullet.name);
    }

    bulletElement.style.left = tank.position[0] + 'px';
    bulletElement.style.top = tank.position[1] + 'px';
  }

  function renderBoard(tanks) {
    const field = document.getElementById('field');
    console.log('rendering', tanks.properties);
    tanks.properties.bots.forEach(bot => {
      renderTank(bot);
    });
    tanks.properties.bullets.forEach(bullet => {
      renderTank(bullet);
    });
    tanks.properties.players.forEach(player => {
      renderTank(player);
    });
  }

  function createBoardHtml(data) {
    console.log('Creating board', data);
  }

  function setEvents(Tanks, tanks) {
    tanks.on('reset', function(params, data) {
      createBoardHtml(data);
    });
    tanks.on('move', function(params) {
      renderBoard(tanks);
    });
    tanks.on('addTank', function(params) {
      renderBoard(tanks);
    });
    document.getElementById('reset-button').addEventListener('click', tanks.methods.reset);
    document.getElementById('join').addEventListener('click', function() {
      let name = document.getElementById('name').value;
      myTankName = name;
      localStorage.setItem('name', name);
      tanks.methods.addTank({name: name, type: 'players'});
    });

    function setKeyDownBindings(e) {
      if (!myTankName) return;
      const button = e.code;

      const moveMap = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowDown: 'bottom',
        ArrowUp: 'top'
      };

      const moveValue = moveMap[button];
      if (moveValue) {
        e.preventDefault();
        tanks.methods.scheduleControllerAction({name: myTankName, action: 'move', value: moveValue});
      }

      if (button === 'Space') {
        tanks.methods.addBullet({name: myTankName, type: 'players'});
      }
    }

    function setKeyUpBindings(e) {
      if (!myTankName) return;

      const button = e.code;

      const moveMap = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowDown: 'bottom',
        ArrowUp: 'top'
      };

      const moveValue = moveMap[button];
      if (moveValue) {
        tanks.methods.scheduleControllerAction({name: myTankName, action: 'move', value: null});
      }
    }

    document.addEventListener('keydown', setKeyDownBindings);
    document.addEventListener('keyup', setKeyUpBindings);

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



