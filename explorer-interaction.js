//save current synth data to preset array
//update traning data where classification output matches patch number
//look for where inputs match then delete existing entry and replace with new synth preset
//when we run out of matches re train the synth regression model
function editPreset(_n) {
  mySynthPreset[parseInt(_n) - 1] = mySynthData.slice();
  let newArray = explorer.trainingSet.map((a) => ({ ...a }));
  for (let i = 0; i < newArray.length; i++) {
    if (newArray[i]["output"][0] == _n) {
      for (let j = 0; j < mySynthTrainingData.length; j++) {
        if (
          newArray[i]["input"][0] == mySynthTrainingData[j]["input"][0] &&
          newArray[i]["input"][1] == mySynthTrainingData[j]["input"][1]
        ) {
          mySynthTrainingData.splice(j, 1);
        }
      }
      mySynthTrainingData.push({
        input: newArray[i]["input"],
        output: mySynthPreset[parseInt(_n) - 1]
      });
    }
  }
  mySynthRegression.train(mySynthTrainingData);
}

//brute force update and retraining of synth synth data used for when K changes
//similar guts as editPreset function but for every synth classification
//using the raw classifcation training data from explorer
function updateSynthPresets() {
  for (let n = 1; n < 10; n++) {
    let newArray = explorer.getUpdatedOutputs().map((a) => ({ ...a }));
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i]["output"][0] == n) {
        for (let j = 0; j < mySynthTrainingData.length; j++) {
          if (
            newArray[i]["input"][0] == mySynthTrainingData[j]["input"][0] &&
            newArray[i]["input"][1] == mySynthTrainingData[j]["input"][1]
          ) {
            mySynthTrainingData.splice(j, 1);
          }
        }
        mySynthTrainingData.push({
          input: newArray[i]["input"],
          output: mySynthPreset[n - 1]
        });
      }
    }
  }
  mySynthRegression.train(mySynthTrainingData);
}

//update value for K and retrain models
const updateK = (k) => {
  myClassification.setK(0, k);
  explorer.updateOutput();
  myRegression.train(explorer.trainingSet);
  try { updateSynthPresets();} catch (error) {};
};

//update hidden nodes and retrain models
const updateHiddenNodes = (n) => {
  mySynthRegression.setNumHiddenNodes(n);
  mySynthRegression.train(mySynthTrainingData);
  myRegression.setNumHiddenNodes(n);
  myRegression.train(explorer.trainingSet);
};

//create rapidLib instance
const rapidLib = window.RapidLib();

//create classification and regression models
//also create demo training sets useful to avoid undefined errors on intialisation
const myClassification = new rapidLib.Classification();

const myRegression = new rapidLib.Regression();
const demoTrainingSet = [
  {
    input: [0, 0],
    output: [0]
  }
];

myClassification.train(demoTrainingSet);
myRegression.train(demoTrainingSet);

const mySynthRegression = new rapidLib.Regression();
const demoSynthTrainingSet = [
  {
    input: [0, 0],
    output: Array.apply(null, Array(108)).map(Number.prototype.valueOf, 0)
  }
];

mySynthRegression.train(demoSynthTrainingSet);

let synthRegressionOutput;

const explorer = new ClassificationExplorer();
explorer.setup("canvas", myClassification);
explorer.recording = true;
explorer.updateOutput();

updateK(1);

let prevXY = [0, 0];
let prevMax = 0;
let myClass = 0;

//scale / map function in p5 & openFrameworks format
function mapScale(value, min1, max1, min2, max2) {
  return Math.floor(min2 + ((value - min1) * (max2 - min2)) / (max1 - min1));
}

//Add Random data to trainingSet
function randomData() {
  for (let i = 0; i < 5; i++) {
    //random float for x & y 0.0-1.0
    let randomInput = [Math.random(), Math.random()];
    //random int for output 1-9
    let randomOutput = [Math.floor(Math.random() * 9) + 1];
    explorer.trainingSet.push({
      input: randomInput,
      output: randomOutput
    });
  }
  explorer.retrain();
  explorer.updateOutput();
  myRegression.train(explorer.trainingSet);
}

//clear data from trainingSet
function clearData() {
  explorer.trainingSet = [];
  explorer.trainingSet.push({
    input: [0, 0],
    output: [0]
  });
  explorer.retrain();
  explorer.updateOutput();
  myRegression.train(explorer.trainingSet);
}

//Size of canvas from rapidLib
myCanvasWidth = explorer.canvas.width;
myCanvasHeight = explorer.canvas.height;

//DOM elements for UI
explorerMouseSpan = document.getElementById("explorerMousePosition");
mouseSpan = document.getElementById("mousePosition");
classSpan = document.getElementById("outputClass");
regressionSpan = document.getElementById("outputRegression");
deltaSpan = document.getElementById("outputDelta");

const kSlider = document.getElementById("kSlider");
const hnSlider = document.getElementById("hnSlider");
const svgSlider = document.getElementById("svgSlider");
const KOutput = document.getElementById("kSliderOutput");
const HNOutput = document.getElementById("HNSliderOutput");
KOutput.innerHTML = "K = 1"; // Display the default slider value
HNOutput.innerHTML = "Hidden Nodes = " + hnSlider.value; // Display the default slider value

let KVal = 1;

document
  .getElementById("svgInput")
  .addEventListener("change", handleFileSelect, false);

let div;
svgSlider.oninput = function () {
  clearData();
  getSVGCoordinates(div);
};

//read SVG input as text
function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

//on file upload write text to innerHTML of temp parent element
function handleFileLoad(event) {
  let file = event.target.result;
  let wrapper = document.createElement("div");
  wrapper.innerHTML = file;
  div = wrapper.firstChild;
  getSVGCoordinates(div);
}

function getSVGCoordinates(_SVG) {
  const pathNumber = _SVG.getElementsByTagName("path").length;
  for (let i = 0; i < pathNumber; i++) {
    let path = _SVG.getElementsByTagName("path")[i];
    let pathLength = Math.floor(path.getTotalLength());
    let width = _SVG.viewBox.baseVal.width;
    let height = _SVG.viewBox.baseVal.height;

    const getXYPercent = (prcnt) => {
      prcnt = (prcnt * pathLength) / 100;

      // Get x and y values at a certain percentage in the line
      pt = path.getPointAtLength(prcnt);
      pt.x = pt.x / width;
      pt.y = pt.y / height;

      let output = [0, 0];

      output.x = Math.round((pt.x + Number.EPSILON) * 100) / 100;
      output.y = Math.round((pt.y + Number.EPSILON) * 100) / 100;

      return [output.x, output.y];
    };

    console.log(svgSlider.value);

    if (pathLength < 200) {
      incrementInput = 5 * svgSlider.value * 0.1;
      increment = Math.round((incrementInput + Number.EPSILON) * 100) / 100;
    } else if (pathLength < 1000) {
      incrementInput = 2 * svgSlider.value * 0.1;
      increment = Math.round((incrementInput + Number.EPSILON) * 100) / 100;
    } else {
      incrementInput = 1 * svgSlider.value * 0.1;
      increment = Math.round((incrementInput + Number.EPSILON) * 100) / 100;
    }

    console.log(increment);

    for (let j = 0; j <= 100; j += increment) {
      let randomOutput = [
        mapScale(Math.round(j + Number.EPSILON), 0, 100, 1, 9)
      ];
      //let randomOutput = [i + 1];
      explorer.trainingSet.push({
        input: getXYPercent(j),
        output: randomOutput
      });
    }
    console.log("Path " + (i + 1) + " of " + pathNumber + " Done!");
  }
  explorer.retrain();
  explorer.updateOutput();
  myRegression.train(explorer.trainingSet);
}

//Event Handler to update the current slider value (each time you drag the slider handle)
kSlider.oninput = function () {
  KOutput.innerHTML = "K = " + this.value;
  let a = parseInt(this.value);
  if (a < 70) {
    updateK(a);
  } else {
    updateK(70);
  }
};

hnSlider.oninput = function () {
  HNOutput.innerHTML = "Hidden Nodes = " + this.value;
  let a = parseInt(this.value);
  updateHiddenNodes(a);
};

//Useful Event Listener to know when you're not in the canvas area e.g. to ignore the rapidLib
document.getElementById("canvas").addEventListener("mouseout", mouseOut, false);

function mouseOut() {
  myClass = 0;
  classSpan.innerHTML = "Classification = " + myClass;
}

let rKey = false;

let KeyPress = (e) => {
  if (!event.repeat) {
    switch (e.code) {
      case "KeyR":
        rKey = true;
        break;
    }
  }
};

let KeyRelease = (e) => {
  switch (e.code) {
    case "KeyR":
      rKey = false;
      break;
  }
};

document.addEventListener("keydown", KeyPress);
document.addEventListener("keyup", KeyRelease);

//Draw loop to continually pull information from rapidLib
function draw() {
  //Get mouse position from rapidLib
  let x = explorer.mouseX;
  let y = explorer.mouseY;

  //First read of explorer mouse pos can be undefined
  //If it is undefined it causes an error when reading from the array later
  if (x == undefined || y == undefined) {
    x = 0;
    y = 0;
  }

  //Standard Pixel Array Index Navigation
  //Scaling unknown canvas size down to RapidLib Size 100x100
  let myIndex =
    mapScale(x, 0, myCanvasWidth, 0, 100) +
    mapScale(y, 0, myCanvasHeight, 0, 100) * 100;
  myClass = explorer.output[myIndex];

  //Set max K value at number of data points
  let max = explorer.trainingSet.length;
  if (max < 70) {
    kSlider.max = max;
  } else {
    kSlider.max = 70;
  }

  //Only refresh mouse position and classification UI elements if mouse position has changed to reduce number of changes to DOM
  if (prevXY[0] != x || prevXY[1] != y) {
    //change UI DOM elements
    mouseSpan.innerHTML = "Mouse X = " + x + " Mouse Y = " + y;
    classSpan.innerHTML = "Classification = " + myClass;
    //Get mouse position within 100x100 system
    rX = mapScale(x, 0, myCanvasWidth, 0, 100) / 100;
    rY = mapScale(y, 0, myCanvasHeight, 0, 100) / 100;
    //Run regression on XY position within the canvas
    regressionOutput = myRegression.run([rX, rY]);
    //Round the output to 2 decimal places
    regressionOutput =
      Math.round((parseFloat(regressionOutput) + Number.EPSILON) * 100) / 100;
    regressionSpan.innerHTML = "Regression = " + regressionOutput;
    //Find the delta between the classification output and the regression output
    let dist =
      Math.round(
        (parseFloat(Math.sqrt(Math.pow(regressionOutput - myClass, 2))) +
          Number.EPSILON) *
          100
      ) / 100;
    deltaSpan.innerHTML = "Delta = " + dist;
	
    //If the R key is pressed run the synth regression
    if (rKey) {
      //run synth regression on canvas XY position
      synthRegressionOutput = mySynthRegression.run([rX, rY]);
      //Stop regression outputs being greater than 1 or less than 0
      //maxiInstruments doesn't like it.
      for (let i = 0; i < mySynthData.length; i++) {
        if (synthRegressionOutput[i] > 1) {
          synthRegressionOutput[i] = 1;
        } else if (synthRegressionOutput[i] < 0) {
          synthRegressionOutput[i] = 0;
        }
        mySynthData[i] = synthRegressionOutput[i];
      }
      //Send data to maxiInstruments
      mySynth.updateValues();
      //Send data to the UI sliders
      updateUI(mySynthData);
    }
  }
  
  //If number of classifications has increased find the highest classification number so far.
  if (prevMax != max) {
    let newArray = explorer.trainingSet.map((a) => ({ ...a }));
    let maxC = newArray[0]["output"][0];
    for (let i = 1; i < newArray.length; ++i) {
      if (newArray[i]["output"][0] > maxC) {
        maxC = newArray[i]["output"][0];
      }
    }
    //push explorer colours to colour picker 
    for (let i = 1; i < maxC + 1; i++) {
      document.getElementById("cC" + i).value = explorer.colours[i];
    }
    myRegression.train(explorer.trainingSet);
  }

  //Store previous mouse X & Y & max classifications
  prevXY = [x, y];
  prevMax = max;

  //Recursive loop
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);