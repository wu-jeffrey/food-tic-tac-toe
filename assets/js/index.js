// I probably should've used a framework... ¯\_(ツ)_/¯
var playerToggle = false; // Variable stores user's turn
var clickCount = 0; // Start testing for wins on 5th click
var iconHash = {}; // Allows users to choose icons

// Map that translates keys to array coordinates
const c = {
  1: {x: 0, y: 0},
  2: {x: 1, y: 0},
  3: {x: 2, y: 0},
  4: {x: 0, y: 1},
  5: {x: 1, y: 1},
  6: {x: 2, y: 1},
  7: {x: 0, y: 2},
  8: {x: 1, y: 2},
  9: {x: 2, y: 2},
}
// This grid will be used for checking for winners
var grid = [
  [0,0,0],
  [0,0,0],
  [0,0,0]
];

(function main() {
  // Trigger modal, attach listeners
  $("#modal").modal();
  $("#play-button").on("click", (e) => {
    // Sets user Icons
    iconHash[0] = $('#healthy-carousel .carousel-inner').find('.carousel-item.active').data()["food"];
    iconHash[1] = $('#junk-carousel .carousel-inner').find('.carousel-item.active').data()["food"];
  
    $("#current-player-icon").css('background-image', "url('assets/images/" + iconHash[0] + ".svg')");
  });

  $("#restart-button").on("click", restart);

  // Box listener marks clicked boxes, toggles user
  $(".box").on('click', (e) => {
    let target = $(e.target);
    if(target.is(`.${iconHash[0]}`) || target.is(`.${iconHash[1]}`)) return; // Stops overwriting occupied boxes
    
    target.addClass(iconHash[Number(playerToggle)]); // Puts icon in DOM grid
    let key = target.data()["key"];
    let y = c[key]["y"];
    let x = c[key]["x"];

    grid[y][x] = "p" + (1 + Number(playerToggle)); // Mark grid occupied in 2D array grid
    console.log(grid); // Keeping this here to make it easy to visualize grid
    
    clickCount++;
    if(clickCount > 8) { // Grid is filled
      gameOver();
    } else if(clickCount > 4) { // A player can only have 3 tics/tacs after 5 clicks
      checkWinner(key);
    }

    // Toggle Player
    playerToggle = !playerToggle;
    $("#current-player-icon").css('background-image', "url('assets/images/" + iconHash[Number(playerToggle)] + ".svg')");
    $("#current-player").text("Player " + (1 + playerToggle) +"'s turn"); // playerToggle should typecast to Number
  })
})();

function checkWinner(key) {
  // Not too DRY but I use key below
  let y = c[key]["y"];
  let x = c[key]["x"];
  let winner = checkColumn(x) || checkRow(y);

  // Only need to check diags on corners && center
  if(key % 2 == 1 && checkDiags()) {
    winner = true;
  }

  if(winner) {
    gameOver(winner);
  }
}

function checkColumn(x) {
  let sum = 0;
  let currentPlayer = "p" + (1 + Number(playerToggle));

  for(let i = 0; i < 3; i++) {
    if(grid[i][x] == currentPlayer) {
      sum++;
    } 
  }
  return sum == 3;
}

function checkRow(y) {
  let sum = 0;
  let currentPlayer = "p" + (1 + Number(playerToggle));

  for(let i = 0; i < 3; i++) {
    if(grid[y][i] == currentPlayer) {
      sum++;
    } 
  }
  return sum == 3;
}

function checkDiags() {
  let sum = 0;
  let currentPlayer = "p" + (1 + Number(playerToggle));

  for(let i = 0; i < 3; i++) {
    if(grid[i][i] == currentPlayer) {
      sum++;
    } 
  }
  if(sum == 3) return true;

  sum = 0;
  for(let i = 0; i < 3; i++) {
    if(grid[i][2-i] == currentPlayer) {
      sum++;
    } 
  }
  return sum == 3;
}

function gameOver(winner) {
  $("#modal").modal();
  $(".btn.btn-primary, [id$='-game']").toggleClass("d-none"); // Banking on the fact there are only 2 btns in DOM, also targets #start-game && #end-game
  
  if(winner) {
    $("#winner").text("Player " + (1 + Number(playerToggle)) + " Wins!");
    $("#winner-icon").css('background-image', "url('assets/images/" + iconHash[Number(playerToggle)] + ".svg')");
  } else {
    $("#winner").text("Tie!");
    $("#winner-icon").css('background-image', "none");
  }
}

function restart() {
  $(".btn.btn-primary, [id$='-game']").toggleClass("d-none"); // Banking on the fact there are only 2 btns in DOM
  $(".box").removeClass([iconHash[0], iconHash[1]]);
  grid = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];
  playerToggle = false; // Variable stores user's turn
  clickCount = 0; // Start testing for wins on 5th click
  iconHash = {}; // Allows users to choose icons
}