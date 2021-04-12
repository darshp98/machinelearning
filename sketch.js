var detector;
var myVid;
var objectResults = [];
var guessB;
var guessed = false;
var slider;
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
  guessB.position(930, 120);
  slider = createSlider(0,10,0,1);
  slider.position(890,420);
  slider.mouseReleased(increaseScore);
  slider.hide();
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
  background(0);
  image(myVid, 0, 0);

  //draw bounding box
  for (var i = 0; i < objectResults.length; i++) {
    var obj = objectResults[i];
    stroke(0, 255, 0);
    noFill();
    rect(obj.x, obj.y, obj.width, obj.height);
  }

  //draw score
  fill(0,255,0);
  noStroke();
  textSize(32);
  text("Score: " + score, 960, 75);

  //when they press the guess button- prints labels and slider
  if (guessed) {
    var x = 800
    var y = 210;
    for (var i = 0; i < objectResults.length; i++) {
      fill(255);
      text(objectResults[i].label, x, y);
      x += 150
      if (x> width-160) {
        y +=50;
        x=800;
      }
    }
    textSize(24);
    fill(255);
    text("How many were correct?", 960, 340);
    slider.show();
    text(slider.value(), 960,390)
   } 
}

function printGuess() {
  guessed = true;
}

function increaseScore() {
  score += int(slider.value());
  guessed = false;
  slider.hide();
}