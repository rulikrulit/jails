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
      field.innerHTML += `<div id="bullet${bullet.name}" class="bullet"></div>`;
      bulletElement = document.getElementById('bullet' + bullet.name);
    }

    bulletElement.style.left = bullet.position[0] + 'px';
    bulletElement.style.top = bullet.position[1] + 'px';
  }

  function renderBoard(tanks) {
    const field = document.getElementById('field');
    const players = tanks.properties.players;
    const bots = tanks.properties.bots;
    const bullets = tanks.properties.bullets;
    bots && bots.forEach(bot => {
      renderTank(bot);
    });
    bullets && bullets.forEach(bullet => {
      renderBullet(bullet);
    });
    players && players.forEach(player => {
      renderTank(player);
    });
  }

  function createBoardHtml(tanks) {
    document.getElementById('field').innerHTML = '';
    renderBoard(tanks);
  }

  function setEvents(Tanks, tanks) {
    tanks.on('reset', function(params, data) {
      createBoardHtml(tanks);
    });
    tanks.on('move', function(params) {
      const entity = tanks.properties[params.type].find(ent => ent.name === params.name);

      switch (params.type) {
        case 'bots':
        case 'players':
          renderTank(entity);
          break;
        case 'bullets':
          renderBullet(entity);
          break;
      }
    });
    tanks.on('addTank', function(params) {
      renderBoard(tanks);
    });
    tanks.on('removeTank', function(params) {
      const tankElement = document.getElementById(params.type + params.name);
      if (tankElement) {
        tankElement.outerHTML = '';
      }
      renderBoard(tanks);
    });
    tanks.on('addBullet', function(params) {
      renderBoard(tanks);
    });
    tanks.on('removeBullet', function(params) {
      const bulletElement = document.getElementById('bullet' + params.name);
      if (bulletElement) {
        bulletElement.outerHTML = '';
      }
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



