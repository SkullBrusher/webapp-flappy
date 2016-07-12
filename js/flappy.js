// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
* Loads all resources for the game and gives them names.
*/

// the scaffolding for Phaser is here
var score = 0;
var player;
var labelScore;
var pipes = [];

function preload() {
  game.load.image("playerImg", "../assets/TIE Fighter.png");
  game.load.image("backgroundImg", "../assets/SpaceBattle.jpg");
  game.load.audio("score", "../assets/Laser.mp3");
  game.load.image("pipeBlock","../assets/TC_Meteor.gif");

}

function generatePipe() {
  var gapStart = game.rnd.integerInRange(1, 5);
  for (var count=0; count<8; count=count+1) {
    if(count != gapStart && count != gapStart + 1) {
      addPipeBlock(800, count * 50);
    }
  }
  changeScore();
  game.world.bringToTop(labelScore)
}



function addPipeBlock(x, y) {
  // create a new pipe block
  var block = game.add.sprite(x,y,"pipeBlock");
  // insert it in the 'pipes' array
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -250;
}


/*
* Initialises the game. This function is only called once.
*/


function create() {
  var background = game.add.image(0, 0, "backgroundImg");
  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(
    pipeInterval,
    generatePipe
  );

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.input
  .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  .onDown.add(spaceHandler);

  background.width = 790;
  background.height = 400;
  game.stage.setBackgroundColor("#262626");
  player = game.add.sprite(300, 170, "playerImg");
  game.physics.arcade.enable(player);
  player.body.velocity.x = 0;
  player.body.velocity.y = -100;
  player.body.gravity.y = 500;
  player.body.gravity.y = 500;
  player.body.gravity.y = 500;
  player.x = 200;
  player.y = 150;
  player.x = player.x + 1;

  game.input.keyboard
  .addKey(Phaser.Keyboard.SPACEBAR)
  .onDown
  .add(playerJump);

  game.input.onDown.add(clickHandler);
  game.input
  .keyboard.addKey(Phaser.Keyboard.RIGHT)
  .onDown.add(moveRight);
  game.input
  .keyboard.addKey(Phaser.Keyboard.LEFT)
  .onDown.add(moveLeft);
  game.input
  .keyboard.addKey(Phaser.Keyboard.UP)
  .onDown.add(moveUp);
  game.input
  .keyboard.addKey(Phaser.Keyboard.DOWN)
  .onDown.add(moveDown);

  labelScore = game.add.text(20, 320,"0");

}
function moveRight() {
  player.x = player.x + 10;

}

function moveLeft() {
  player.x = player.x - 10;

}

function moveUp() {
  player.y = player.y - 10;

}

function moveDown() {
  player.y = player.y + 10;

}

function clickHandler(event) {
  game.add.sprite(event.x, event.y, "playerImg");
  alert("INITIATE COMBAT!","The position is: " + event.x + "," + event.y);
}

function changeScore() {
  score = score + 1;
  labelScore.setText(score.toString());

}

function spaceHandler() {
  game.sound.play("score");
}

function playerJump() {
  player.body.velocity.y = -200;

}
//This function updates the scene. It is called for every new frame.

function update() {
  game.physics.arcade.overlap(
    player,
    pipes,
    gameOver);

    if(player.y < 0 || player.y > 400){
      gameOver();
    }
  }

  function gameOver(){
    game.destroy();
    registerScore();
    location.reload();
  }
