function ClassificationExplorer() {
  //the dimensions of the rapidLib
  this.TEST_SET_W = 100;
  this.TEST_SET_H = 100;
  //used to show or hide the data points
  this.debug = true;
  //array to store rapidLib output
  this.output = new Array(this.TEST_SET_W * this.TEST_SET_H);
  //default colours for explorer
  this.colours = [
    "",
    "#0ED779",
    "#4D42EB",
    "#FFCE00",
    "#F79994",
    "#ED3D05",
    "#1EA4D9",
    "#01A8E5",
    "#D52366",
    "#01E578"
  ];

  this.recording = false;
  
  //get canvas we're using and create event listeners
  this.setup = (canvasName, myClassification) => {
    this.canvasName = canvasName;
    this.myClassification = myClassification;
    this.canvas = document.getElementById(this.canvasName);
    this.context = canvas.getContext("2d");
    window.requestAnimationFrame(this.draw);
    this.canvas.addEventListener("mousemove", this.move);
    this.recordingClass = -1;
    this.trainingSet = [];
    window.addEventListener("keyup", this.stopRecord, false);
    window.addEventListener("keydown", this.startRecord, false);
  };

  //track mouse position
  this.move = (mousePosition) => {
    if (mousePosition.layerX || mousePosition.layerX === 0) {
      this.mouseX = mousePosition.layerX;
      this.mouseY = mousePosition.layerY;
    } else if (mousePosition.offsetX || mousePosition.offsetX === 0) {
      this.mouseX = mousePosition.offsetX;
      this.mouseY = mousePosition.offsetY;
    }
    if (this.recordingClass > 0 && this.recording) {
      var rapidInput = [
        this.mouseX / this.canvas.width,
        this.mouseY / this.canvas.height
      ];
      var rapidOutput = [this.recordingClass];
      this.trainingSet.push({
        input: rapidInput,
        output: rapidOutput
      });
    }
  };

  //toggle debug bool used on button press
  this.toggleDebug = () => {
    if (this.debug == true) {
      this.debug = false;
    } else {
      this.debug = true;
    }
  };

  //on key press record input
  this.startRecord = (e) => {
    if (e.keyCode > 47 && e.keyCode < 58) {
      this.recordingClass = e.keyCode - 48;
    }
  };

  //on key release stop recording and update
  this.stopRecord = (e) => {
    if (e.keyCode > 47 && e.keyCode < 58) {
      this.recordingClass = -1;
      this.retrain();
      this.updateOutput();
    }
  };
  
  //pixel array navigation
  this.ptForIndex = (i) => {
    return { x: i % this.TEST_SET_W, y: Math.floor(i / this.TEST_SET_H) };
  };
  
  //retrain rapidLib function
  this.retrain = () => {
    this.myClassification.train(this.trainingSet);
  };
  
  //return an array that contains the classifications per data point post training
  //used for when values of K within the KNN have changed
  this.getUpdatedOutputs = () => {
    this.tempTrainingSet = this.trainingSet.map((a) => ({ ...a }));
    for (let i = 0; i < this.tempTrainingSet.length; i++) {
    this.out = this.myClassification.run([this.trainingSet[i]["input"][0],this.trainingSet[i]["input"][1]]);
    this.tempTrainingSet[i]["output"][0] = this.out;
    }
    return this.tempTrainingSet;
  }
  
  //Rerun the classification and update the output array
  this.updateOutput = () => {
    for (let i = 0; i < this.output.length; i++) {
      const pt = this.ptForIndex(i);
      const output = this.myClassification.run([
        pt.x / this.TEST_SET_W,
        pt.y / this.TEST_SET_H
      ]);
      this.output[i] = output;
    }
  };
  
  //Draw the output of the rapidLib classification to the canvas
  this.draw = () => {
    //clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //step value for pixels to create kernals i.e. rapidLib is lower resolution than canvas
    const fillW = this.canvas.width / this.TEST_SET_W;
    const fillH = this.canvas.height / this.TEST_SET_H;
    //for every output fill kernal with corresponding colour
    for (let i = 0; i < this.output.length; i++) {
      const pt = this.ptForIndex(i);
      this.context.fillStyle = this.colours[
        this.output[i] % this.colours.length
      ];
      this.context.fillRect(pt.x * fillW, pt.y * fillH, fillW, fillH);
    }
    //default to showing datapoints as outlined
    //else datapoint is hidden within classification
    if (this.debug == true) {
      for (let i = 0; i < this.trainingSet.length; i++) {
        const data = this.trainingSet[i];
        this.context.fillStyle = this.colours[
          data.output % this.colours.length
        ];
        this.context.fillRect(
          data.input[0] * this.canvas.width,
          data.input[1] * this.canvas.height,
          fillW,
          fillH
        );
        this.context.strokeStyle = "#FFF";
        this.context.strokeRect(
          data.input[0] * this.canvas.width,
          data.input[1] * this.canvas.height,
          fillW,
          fillH
        );
      }
    } else {
      for (let i = 0; i < this.trainingSet.length; i++) {
        const data = this.trainingSet[i];
        this.context.fillStyle = this.colours[
          data.output % this.colours.length
        ];
        this.context.fillRect(
          data.input[0] * this.canvas.width,
          data.input[1] * this.canvas.height,
          fillW,
          fillH
        );
      }
    }
    //recursive draw loop to redraw canvas
    window.requestAnimationFrame(this.draw);
  };
}