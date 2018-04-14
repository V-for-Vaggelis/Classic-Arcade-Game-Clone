// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.y = 131;
  // 101px is the height of each background box, so I initialize the prototype enemy at the middle stone box
  this.x = -150;
  // To make it start offscreen
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x > 500) {
    this.x = -150;
    if (this.y === 48) {
      this.y = 48 + 83;
    }
    else if (this.y === 131) {
      this.y = 131 + 83;
    }
    else {
      this.y = 48;
    }
  }
  if (this.speed === 1) {
    this.x = this.x + 180*dt;
  }
  else if (this.speed === 2) {
    this.x = this.x + 250*dt;
  }
  else if (this.speed === 3) {
    this.x = this.x + 330*dt;
  }
  else {
    this.x = this.x + 400*dt;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method which will respond to the arrow presses by moving the player.
var Player = function() {
  this.x = 4*78;
  this.y = 3*107;
  this.sprite = 'images/char-boy.png'
}

Player.prototype.update = function(dy = 0, dx = 0) {
  this.x = this.x + dx;
  this.y = this.y + dy;
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPressed) {
  let xMove = 0;
  let yMove = 0;
  if ((keyPressed === "left") && (this.x >100)) {
    xMove = -101;
  }
  else if ((keyPressed === "right") && (this.x < 400)) {
    xMove = 101;
  }
  else if ((keyPressed === "up") && (this.y > 0)) {
    yMove = -83;
  }
  else if ((keyPressed === "down") && (this.y < 332 )) {
    yMove = 83;
  }
  this.update(yMove, xMove);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
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

function shuffleEnemies() {
  let yPos = [48];
  for (let i=0; i<2; i++) {
    let yNext = yPos[i] + 83;
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
/*var enemy1 = new Enemy();
var enemy2 = new Enemy();
var allEnemies = [enemy1, enemy2];
*/
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
