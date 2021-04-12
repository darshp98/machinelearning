var detector;
var myVid;
var objectResults = [];
var guessB, correctB, incorrectB;
var guessed = false;
var score = 0;

function preload() {
  detector = ml5.objectDetector("cocossd");
}

function setup() {
  createCanvas(1280, 480);
  textAlign(CENTER);

  myVid = createCapture(VIDEO, videoLoaded);
  guessB = createButton('Guess!');
  guessB.mousePressed(printGuess);
  guessB.position(900, 175);
}

function videoLoaded() {
  myVid.size(640, 480);
  myVid.hide();
  detector.detect(myVid, objectsIded); //runs object detection and calls callback
}

//callbacks on ml5 functions are error first, then the data
function objectsIded(error, results) {
  if (error) {
    console.error(error); //stops the process rather than just printing
  } else {
    objectResults = results;
    detector.detect(myVid, objectsIded); //function calls itself (recursive function)
  }
}

function draw() {
  background(220);
  image(myVid, 0, 0);

  //draw bounding box
  for (var i = 0; i < objectResults.length; i++) {
    var obj = objectResults[i];
    stroke(0, 255, 0);
    noFill();
    rect(obj.x, obj.y, obj.width, obj.height);
  }

  //draw score
  fill(0);
  noStroke();
  textSize(32);
  text("Score: " + score, 960, 100);

  //when they press the guess button
  if (guessed) {
    var x = 750
    for (var i = 0; i < objectResults.length; i++) {
      text(objectResults[i].label, x, 300);
      x += 150
    }
    textSize(24);
    text("Was this correct?", 960, 375);
    if (!incorrectB) {
      incorrectB = createButton('No');
      incorrectB.mousePressed(decreaseScore);
      incorrectB.position(950, 450);
      correctB = createButton('Yes');
      correctB.mousePressed(increaseScore);
      correctB.position(850, 450);
    }
    incorrectB.show();
    correctB.show();
  } 
}

function printGuess() {
  guessed = true;
}

function increaseScore() {
  score += 1;
  guessed = false;
  incorrectB.hide();
  correctB.hide();
}

function decreaseScore() {
  score -= 1;
  guessed = false;
  incorrectB.hide();
  correctB.hide();
}