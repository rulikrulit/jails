function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}
function createColors() {
  var colors = [];
  ['red', 'green', 'orange', 'blue', 'yellow'].forEach(function(color, i) {
    for (let i = 1; i <= 20; i++) {
      colors.push(color);
    }
  });
  return shuffle(colors);
}

function setChunks(colors) {
  var i,j,temparray,chunk = 10, result = [];
  for (i = 0, j = colors.length; i < j; i+=chunk) {
      temparray = colors.slice(i,i + chunk);
      result.push(temparray);
  }

  result[4][4] = result[4][5] = result[5][4] = result[5][5] = 'empty';

  return result;
}

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

function createBoardHtml(colors) {
  let size = calculateSize();
  var boardHTML = '<tr>';
  colors.forEach(function(colorsChunk, i) {
    colorsChunk.forEach(function(color, j) {
      boardHTML += `<td><div class="piece piece_${color}" style="width: ${size}px; height: ${size}px"></div></td>`;
      if ((j + 1) % 10 === 0) {
        boardHTML += '</tr><tr>';
      }
    });
  });
  boardHTML += '</tr>';

  return boardHTML;

}
var colors = createColors();

document.getElementById('board').innerHTML = createBoardHtml(setChunks(colors));



