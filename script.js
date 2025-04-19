
const MAX_HEIGHT = 4;
const COLORS = ["red", "blue", "green"];
const NUM_BOTTLES = COLORS.length + 2;

let bottles = [];
let selected = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeGame() {
  const allColors = [];
  COLORS.forEach(color => {
    for (let i = 0; i < MAX_HEIGHT; i++) {
      allColors.push(color);
    }
  });
  shuffle(allColors);

  bottles = [];
  for (let i = 0; i < NUM_BOTTLES; i++) {
    bottles.push([]);
  }

  let index = 0;
  for (let i = 0; i < NUM_BOTTLES; i++) {
    for (let j = 0; j < MAX_HEIGHT; j++) {
      if (index < allColors.length) {
        bottles[i].push(allColors[index++]);
      }
    }
  }
}


function render() {
  const game = document.getElementById("game");
  game.innerHTML = "";

  bottles.forEach((bottle, idx) => {
    const bottleDiv = document.createElement("div");
    bottleDiv.className = "bottle" + (selected === idx ? " selected" : "");
    bottleDiv.onclick = () => handleBottleClick(idx);

    for (let i = 0; i < bottle.length; i++) {
      const colorDiv = document.createElement("div");
      colorDiv.className = "color " + bottle[i];
      bottleDiv.appendChild(colorDiv);
    }

    game.appendChild(bottleDiv);
  });

  if (isGameCleared()) {
    document.getElementById("message").textContent = "🎉 ゲームクリア！おめでとう！";
  } else {
    document.getElementById("message").textContent = "";
  }
  
}



function getTopColors(bottle) {
  if (bottle.length === 0) return [];
  let color = bottle[bottle.length - 1];
  let count = 1;
  for (let i = bottle.length - 2; i >= 0; i--) {
    if (bottle[i] === color) count++;
    else break;
  }
  return Array(count).fill(color);
}

function canPour(fromIdx, toIdx) {
  const from = bottles[fromIdx];
  const to = bottles[toIdx];
  if (from.length === 0 || to.length >= MAX_HEIGHT) return false;
  const movingColors = getTopColors(from);
  const topTo = to[to.length - 1];
  if (!topTo) return true;
  return topTo === movingColors[0] && (to.length + movingColors.length <= MAX_HEIGHT);
}

function pour(fromIdx, toIdx) {
  if (!canPour(fromIdx, toIdx)) return;
  const from = bottles[fromIdx];
  const to = bottles[toIdx];
  const movingColors = getTopColors(from);
  for (let i = 0; i < movingColors.length; i++) {
    to.push(from.pop());
  }
}

function handleBottleClick(idx) {
  if (selected === null) {
    selected = idx;
  } else if (selected === idx) {
    selected = null;
  } else {
    pour(selected, idx);
    selected = null;
  }
  render();
}

function isGameCleared() {
  return bottles.every(bottle =>
    bottle.length === 0 || (bottle.length === MAX_HEIGHT && bottle.every(c => c === bottle[0]))
  );
}
function resetGame() {
  selected = null;
  initializeGame();
  render();
}


initializeGame();
render();