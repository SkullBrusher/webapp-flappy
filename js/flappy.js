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
var gapMargin = 50;
var gapSize = 100;
var blockHeight = 50;
var height = 400;
var width = 790;
var balloons = [];
var weights = [];
var gameGravity = 400;
var balloonValue = 170;

function preload() {
  game.load.image("playerImg", "../assets/TIE Fighter.png");
  game.load.image("backgroundImg", "../assets/SpaceBattle.jpg");
  game.load.audio("score", "../assets/Laser.mp3");
  game.load.image("pipeBlock","../assets/TC_Meteor.gif");
  game.load.image("balloons","../assets/Energy.png");

}

function generatePipe() {
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

   for(var y = gapStart; y > 0; y -= blockHeight){
       addPipeBlock(width, y - blockHeight);
   }

   for(var y = gapStart + gapSize; y < height; y += blockHeight) {
       addPipeBlock(width, y);
   }
   changeScore();
  game.world.bringToTop(labelScore);
}

function generateBalloons(){
    var BHeight = game.rnd.integerInRange(0, height-50)
    var bonus = game.add.sprite(width, BHeight, "balloons");
    bonus.width = 50;
    bonus.height = 50;
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 250;
    bonus.body.velocity.y = game.rnd.integerInRange(180, 200);
    var Direction = game.rnd.integerInRange(0, 1);
    if (Direction == 0) {
      bonus.body.velocity.y *=-1;
    }
}

function start(){

splashDisplay.destroy();
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
  var pipeInterval = 1.30 * Phaser.Timer.SECOND;
  game.time.events.loop(
    pipeInterval,
    generate
  );

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.input
  .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  .onDown.add(spaceHandler);

  player = game.add.sprite(300, 170, "playerImg");
  game.physics.arcade.enable(player);
  player.anchor.setTo(0.5, 0.5);
  player.body.velocity.x = 0;
  player.body.velocity.y = -100;
  player.body.gravity.y = gameGravity;
  player.x = 200;
  player.y = 150;
  player.x = player.x + 1;

  game.input.keyboard
  .addKey(Phaser.Keyboard.SPACEBAR)
  .onDown
  .add(playerJump);

  labelScore = game.add.text(20, 320,"0");

  /*
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
  */

  game.paused = false;
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
  background.width = 790;
  background.height = 400;
  game.stage.setBackgroundColor("#262626");

  splashDisplay = game.add.text(120,150, "Press ENTER to start, SPACEBAR to fly",{fill : "white"});

  game.paused = true;
  game.input
  .keyboard.addKey(Phaser.Keyboard.ENTER)
  .onDown.add(start);
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 4);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
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

function generateWeight() {


}
//This function updates the scene. It is called for every new frame.


function changeGravity(g) {
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}

function update() {

  for(var i = balloons.length - 1; i >= 0; i--){

      game.physics.arcade.overlap(player, balloons[i], function(){

        changeGravity(-balloonValue);
        game.time.events.add(5 * Phaser.Timer.SECOND,
          function () {changeGravity(balloonValue);}
        );

        balloons[i].destroy();
        balloons.splice(i, 1);

      });
  }

  for (var count = 0; count <balloons.length; count +=1){
    if (balloons[count].y<0){
      balloons[count].y=5;
      balloons[count].body.velocity.y *=-1;
    }
    if (balloons[count].y>height-50){
      balloons[count].y=height-55;
      balloons[count].body.velocity.y*=-1;
    }
  }

  var gameSpeed = 200;

  game.physics.arcade.overlap(
    player,
    pipes,
    gameOver);

    if(player.y < 0 || player.y > 400){
      gameOver();
    }



    player.rotation = Math.atan(player.body.velocity.y / 1000);
  }

  function gameOver(){
    score=0;
    gameGravity = 500;
      registerScore();
    game.state.restart();

  //  location.reload();
  }
