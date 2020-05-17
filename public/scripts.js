(function() {

  const colors = ['red', 'green', 'orange', 'blue', 'yellow'];

  document.getElementById('name').value = localStorage.getItem('name');

  function calculateSize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let borderSize = 3;

    let base = width;

    if (height < width) {
      base = height;
    }

    let offset = borderSize * 11 + 40;

    let size = (base - offset) / 10;

    return size;
  }

  function renderBoard(skipiti) {
    console.log('rendering', skipiti.properties);
    createBoardHtml(skipiti.properties.board);
    createPlayersHtml(skipiti.properties.players);
    if (skipiti.properties.active) {
      document.querySelector(`[x="${skipiti.properties.active.x}"][y="${skipiti.properties.active.y}"]`).classList.add('blinking');
    }


    skipiti.properties.removed.forEach(function(item) {
      document.querySelector(`[x="${item.x}"][y="${item.y}"]`).classList.add('removed');
    });

    if (skipiti.properties.currentPlayer) {
      document.getElementById('current-player').innerHTML = skipiti.properties.currentPlayer;
    }
  }

  function createBoardHtml(colors) {
    let size = calculateSize();
    let boardHTML = '<tr>';
    colors.forEach(function(colorsChunk, i) {
      colorsChunk.forEach(function(color, j) {
        boardHTML += `<td><div x=${j} y=${i} class="piece piece_${color}" style="width: ${size}px; height: ${size}px"></div></td>`;
        if ((j + 1) % 10 === 0) {
          boardHTML += '</tr><tr>';
        }
      });
    });
    boardHTML += '</tr>';

    document.getElementById('board').innerHTML = boardHTML;

    let scoreLines = document.querySelectorAll('.score-line');
    for (let line of scoreLines) {
      if (line.matches('.score-line-horizontal')) {
        line.style.width = 8 * size + 'px';
        line.style.height = 1.5 * size + 'px';
      } else {
        line.style.width = 1.5 * size + 'px';
        line.style.height = 8 * size + 'px';
        line.style.marginTop = -4 * size + 'px';
      }
    }

    let boardContainer = document.getElementById('board-container');
    boardContainer.style.width = (33 + size * 13) + 'px';
  }

  function createPlayersHtml(players) {
    let size = calculateSize();
    let boardHTML = '<tr><th></th>';
    players.forEach(function(player, i) {
      boardHTML += `<th>${player.name}</th>`;
    });
    boardHTML += '</tr>';

    colors.forEach(function(color) {
      boardHTML += `<tr><td>${color}</td>`;
      players.forEach(function(player, i) {
        boardHTML += `<td>${player.bank[color]}</td>`;
      });
    });
    boardHTML += '</tr>';

    document.getElementById('players').innerHTML = boardHTML;

  }

  function setEvents(Skipiti, skipiti) {
    skipiti.on('reset', function(params, data) {
      createBoardHtml(data);
    });
    skipiti.on('setActive', function(params) {
      renderBoard(skipiti);
    });
    skipiti.on('move', function(params) {
      renderBoard(skipiti);
    });
    skipiti.on('join', function(params) {
      renderBoard(skipiti);
    });
    skipiti.on('finishMove', function(params) {
      renderBoard(skipiti);
    });
    document.getElementById('reset-button').addEventListener('click', skipiti.methods.reset);
    document.getElementById('finish-move').addEventListener('click', function() {
      skipiti.methods.finishMove({name: localStorage.getItem('name')});
    });
    document.getElementById('join').addEventListener('click', function() {
      let name = document.getElementById('name').value;
      localStorage.setItem('name', name);
      skipiti.methods.join({name: name});
    });

    document.getElementById('board').addEventListener('click', function(e) {
      let target = e.target;
      let x = +target.getAttribute('x');
      let y = +target.getAttribute('y');
      if (target.classList.contains('piece')) {

        if (target.classList.contains('piece_empty')) {
          skipiti.methods.move({x: x, y: y, name: localStorage.getItem('name')});
        } else {
          skipiti.methods.setActive({x: x, y: y, name: localStorage.getItem('name')});
        }
      }
    });
  }

  let jailsCreator = new JailsCreator();
  let jail = jailsCreator.jail;
  jailsCreator.indexPromise.then(() => {
    const Skipiti = jail.loadModel('SKIPITI');
    Skipiti.on('create', function(skipiti) {
      console.log('skipiti create', skipiti);
      Skipiti.methods.getModel({id: 0});
    });

    Skipiti.on('getModel', function(skipiti) {
      console.log('getting skipiti', skipiti);
      if (skipiti.id === 0) {
        console.log('skipiti.id 0');
        setEvents(Skipiti, skipiti);
        renderBoard(skipiti);
      } else {
        Skipiti.methods.create();
      }
    });


    Skipiti.methods.getModel({id: 0});
  });
})();



