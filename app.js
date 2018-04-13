// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.y = 101;
    // 101px is the height of each background box, so I initialize the prototype enemy at the top stone box
    this.x = 0;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    setTimeout(function() {
      this.x = this.x + 1;
    }, dt);
    // This timeout will create an effect for the moving enemy
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method which will respond to the arrow presses by moving the player.
var Player = function() {
  this.x = 4*83;
  this.y = 4*101;
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
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var allEnemies = [enemy1, enemy2];
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
