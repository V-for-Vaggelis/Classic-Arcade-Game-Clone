/* I'll create an array holding all the possible y positions for the player and the enemies
the position numbers were found after testing, the position step is related with the height of the icons used */
let allY = [-11];
let yStep = 83;
for (i=0; i<6; i++) {
  allY.push(allY[i] + yStep);
}
/* In the same logic, an array holding all the x positions, those are just for the player though cause the enemies move smoothly in the x axis
the step here is related with the icon's width */
let allPlayerX = [9];
let xStep = 101;
for (let i=0; i<4; i++) {
  allPlayerX.push(allPlayerX[i] + xStep);
}
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.y = allY[4];
  // 101px is the height of each background box, so I initialize the prototype enemy at the middle stone box
  this.x = -150;
  // To make it start offscreen
  this.height = 171;
  this.width = 101;
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x > 500) {
    this.x = -150;
    // When the enemy leaves screenn from the right, place them on the left again to re-appear, also change his y position to the next one
    if (this.y === allY[1]) {
      this.y = allY[2];
    }
    else if (this.y === allY[2]) {
      this.y = allY[3];
    }
    else {
      this.y = allY[1];
    }
  }
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.speed === 1) {
    this.x = this.x + 160*dt;
  }
  else if (this.speed === 2) {
    this.x = this.x + 220*dt;
  }
  else if (this.speed === 3) {
    this.x = this.x + 300*dt;
  }
  else {
    this.x = this.x + 370*dt;
  }
  this.checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollision = function() {
  /* Collision detection logic from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection.
  I basically handle the enemies and player as straight lines in spacem since their y values have fixed values that are same for both */
  if (this.x < player.x + (player.width - 40) &&
  this.x + (this.width - 40) > player.x &&
  this.y === player.y) {
    // collision detected --> restart player with delay for extra effect
    setTimeout( function() {
      player.restart();
    }, 400);
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method which will respond to the arrow presses by moving the player.
var Player = function() {
  this.x = allPlayerX[3];
  this.y = allY[4];
  this.height = 171;
  this.width = 101;
  this.sprite = 'images/char-boy.png'
}

// This function creates the player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function will update the player's position when called
Player.prototype.update = function(dy = 0, dx = 0) {
  this.x = this.x + dx;
  this.y = this.y + dy;
};

// This function will handle arrow keys pressed
Player.prototype.handleInput = function(keyPressed) {
  let xMove, yMove;
  // The second statement in each of the if's checks so that the player can't move off-canvas
  if ((keyPressed === "left") && (this.x !== allPlayerX[0])) {
    xMove = -xStep;
  }
  else if ((keyPressed === "right") && (this.x !== allPlayerX[4])) {
    xMove = xStep;
  }
  else if ((keyPressed === "up") && (this.y !== allY[0])) {
    yMove = -yStep;
  }
  else if ((keyPressed === "down") && (this.y !== allY[5])) {
    yMove = yStep;
  }
  // Render the move
  this.update(yMove, xMove);
  // Check if the player wins after this move
  this.checkWin();
};

// This function will re-place the player on the initial positio when called
Player.prototype.restart = function() {
  this.x = allPlayerX[3];
  this.y = allY[4];
}

// This function checks if the player wins the game by checking his y position
Player.prototype.checkWin = function() {
  let myPlayer = this;
  // Because this won't be directly identified into the timeout
  if (this.y === allY[0]) {
    setTimeout( function() {
      myPlayer.restart();
    }, 400);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
// I'll create enemies moving on different speed for extra difficulty
for (let i=1; i<5; i++) {
  let enemy = new Enemy();
  enemy.speed = i;
  allEnemies.push(enemy);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// This will make sure that after a page reload the enemies don't move in the same pattern as before
function shuffleEnemies() {
  let yPos = [allY[1]];
  for (let i=0; i<2; i++) {
    let yNext = yPos[i] + yStep;
    yPos.push(yNext);
  }
  yPos.push(yPos[0]);

  shuffle(allEnemies);
  shuffle(yPos);

  for (let i=0; i<4; i++) {
    allEnemies[i].y = yPos[i];
  }
}
shuffleEnemies();
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
