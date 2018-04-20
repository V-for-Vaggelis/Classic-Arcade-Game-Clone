
/* I'll create an array holding all the possible y positions for the player and the enemies
the position numbers were found after testing, the position step is related with the height of the icons used */
let allY = [60];
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
let enemiesScoreCount = 0;
let enemiesScore = document.getElementById('enemy-score');
let playerScoreCount = 0;
let playerScore = document.getElementById('your-score');
let medal = document.getElementById('medal');
let trophy = document.getElementById('trophy');
let ballon = document.getElementById('ballon');
let timeOutStart;
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
  this.sprite = 'images/tackle.png';
  this.freeze = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  //The freeze variable will help me pause all movememnt for a bit when collision occurs
  if (!this.freeze) {
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
    // On every update check if enemy collides with player
    this.checkCollision();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // This renders the faces upon a tackling figure
  ctx.drawImage(Resources.get(this.sprite2), this.x + 11, this.y);
};

Enemy.prototype.checkCollision = function() {
  /* Collision detection logic from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection.
  I basically handle the enemies and player as straight lines in spacem since their y values have fixed values that are same for both */
  if (this.x < player.x + (player.width-50) &&
  this.x + (this.width-50) > player.x &&
  this.y === player.y) {
    // When collision is detected I'll freeze all moving objects, also make the player look dead
    for (let enemy of allEnemies) {
      enemy.freeze = true;
    }
    for (let reward of collectibles) {
      reward.freeze = true;
    }
    if (player.sprite2 === "images/Messi.png") {
      player.sprite2 = "images/Messi-dead.png";
    }
    else if (player.sprite2 === "images/Ronaldo.png"){
      player.sprite2 = "images/Ronaldo-dead.png";
    }
    else {
      player.sprite2 = "images/Neymar-dead.png";
    }
    /* collision detected --> restart player with delay for extra effect, the boolean will help ensure
    the user can't move the player until the collision effect is over */
    timeOutStart = true;
    setTimeout( function() {
      if (!player.dead) {
        player.dead = true;
        player.restart();
        if (player.sprite2 === "images/Messi-dead.png") {
          player.sprite2 = "images/Messi.png";
        }
        else if (player.sprite2 === "images/Ronaldo-dead.png"){
          player.sprite2 = "images/Ronaldo.png";
        }
        else {
          player.sprite2 = "images/Neymar.png";
        }
        // update score table
        enemiesScoreCount += 1;
        enemiesScore.textContent = enemiesScoreCount;
      }
      timeOutStart = false;
    }, 500);
    player.dead = false;
    // Lose all any trophies collected before getting killed
    for (let reward of collectibles) {
      if (reward.picked === true) {
        reward.picked = false;
      }
    }
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method which will respond to the arrow presses by moving the player.
var Player = function() {
  this.x = allPlayerX[3];
  this.y = allY[4];
  this.height = 171;
  this.width = 101;
  this.sprite = 'images/ball.png';
  this.dead = false;
};

// This function creates the player
Player.prototype.render = function() {
  // A ball moves along with the player's face
  ctx.drawImage(Resources.get(this.sprite2), this.x, this.y);
  ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 40);
};

// This function will update the player's position when called
Player.prototype.update = function(dy = 0, dx = 0) {
  this.x = this.x + dx;
  this.y = this.y + dy;
};

// This function will handle arrow keys pressed
Player.prototype.handleInput = function(keyPressed) {
  // Only move player if everything is not frozen
  if (!timeOutStart) {
    let xMove, yMove;
    // The second statement in each of the if's checks so that the player can't move off-canvas
    if ((keyPressed === "left") && (this.x !== allPlayerX[0])) {
      xMove = -xStep;
      this.update(yMove, xMove);
      // Render the move
    }
    else if ((keyPressed === "right") && (this.x !== allPlayerX[4])) {
      xMove = xStep;
      this.update(yMove, xMove);
    }
    else if ((keyPressed === "up") && (this.y !== allY[0])) {
      yMove = -yStep;
      this.update(yMove, xMove);
      this.checkWin();
      // Check if the player wins after this move
    }
    else if ((keyPressed === "down") && (this.y !== allY[5])) {
      yMove = yStep;
      this.update(yMove, xMove);
    }
  }
};

// This function will re-place the player on the initial positio when called
Player.prototype.restart = function() {
  this.x = allPlayerX[3];
  this.y = allY[4];
  // Unfreeze the movables if they froze from a collision
  for (let enemy of allEnemies) {
    enemy.freeze = false;
  }
  for (let reward of collectibles) {
    reward.freeze = false;
  }
};

// This function checks if the player wins the game by checking his y position
Player.prototype.checkWin = function() {
  let myPlayer = this;
  // Because this won't be directly identified into the timeout
  if (this.y === allY[0]) {
    playerScoreCount += 1;
    playerScore.textContent = playerScoreCount;
    for (let reward of collectibles) {
      reward.collectPickedRewards();
    }
    // Win any rewards picked before scoring
    setTimeout( function() {
      myPlayer.restart();
    }, 500);
  }
};

// Constructor for collectible objects
var Collectible = function() {
  this.picked = false;
  this.collected = false;
  this.x = -5000;
  // Way off-screen
  this.width = 70;
  this.height = 70;
  this.freeze = false;
};

Collectible.prototype.render = function() {
  // A collection happens if the player picked the prize and then scored, so if the prizes are picked or collected they are not rendered
  if (!this.collected && !this.picked) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

Collectible.prototype.update = function(dt) {
  if (!this.freeze) {
    if (this.x > 500) {
      this.x = -5000;
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
    if (this.speed === 1) {
      this.x = this.x + 270*dt;
    }
    else if (this.speed === 2) {
      this.x = this.x + 320*dt;
    }
    else {
      this.x = this.x + 400*dt;
    }
    // On every update check if the item is picked
    this.checkPick();
  }
};

Collectible.prototype.checkPick = function() {
  if (this.x < player.x + (player.width) &&
  this.x + (this.width) > player.x &&
  this.y === player.y) {
    // collision detected --> pick reward
    this.picked = true;
  }
};

// A function to be called once the player scores and collect all his picked trophies
Collectible.prototype.collectPickedRewards = function() {
  if (this.picked === true) {
    this.collected = true;
    if (this.sprite === "images/medal.png") {
      // So trophy on the left panel
      medal.classList.remove("collectibles");
      medal.classList.add("collectibles-open");
    }
    else if (this.sprite === "images/trophy.png") {
      trophy.classList.remove("collectibles");
      trophy.classList.add("collectibles-open");
    }
    else {
      ballon.classList.remove("collectibles");
      ballon.classList.add("collectibles-open");
    }
  }
};

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
allEnemies[0].sprite2 = 'images/Pique.png';
allEnemies[1].sprite2 = 'images/Chiellini.png';
allEnemies[2].sprite2 = 'images/Pepe.png';
allEnemies[3].sprite2 = 'images/Ramos.png';

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
function shufflePositionY(movingItems) {
  let yPos = [allY[1]];
  for (let i=0; i<2; i++) {
    let yNext = yPos[i] + yStep;
    yPos.push(yNext);
  }
  yPos.push(yPos[0]);

  shuffle(movingItems);
  shuffle(yPos);
  let i = 0;
  for (let item of movingItems) {
    i = i + 1;
    item.y = yPos[i];
  }
}
shufflePositionY(allEnemies);
var player = new Player();
player.sprite2 = 'images/Messi.png';

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

// Same logic as used above to create enemies
var collectibles = [];
for (let i=1; i<4; i++) {
  let collectible = new Collectible();
  collectible.speed = i;
  collectibles.push(collectible);
}
collectibles[0].sprite = 'images/medal.png';
collectibles[1].sprite = 'images/trophy.png';
collectibles[2].sprite = 'images/ballon.png';
shufflePositionY(collectibles);

// Give the user ability to select another player
let messi = document.getElementById("Messi-bench");
let ronaldo = document.getElementById("Ronaldo-bench");
let neymar = document.getElementById("Neymar-bench");
let characters = [messi, ronaldo, neymar];
let charPic = ["images/Messi.png", "images/Ronaldo.png", "images/Neymar.png"];
let bench = document.getElementById("bench");
bench.addEventListener('click', function(evt) {
  let clickedPlayer = evt.target;
  for (let i=0; i<3; i++) {
    if (characters[i] === clickedPlayer) {
      player.sprite2 = charPic[i];
      characters[i].classList.add("player-active");
    }
    else if (characters[i].classList.contains("player-active")) {
      characters[i].classList.remove("player-active");
    }
  }
});
