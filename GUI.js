//Generate UI Dom elements programmatically 
function addGUI(_div, _synthData) {
  //Arrays of strings to loop through
  const labels = [
    ["EDIT SYNTHS"],
    ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"],
    ["SINE", "TRI", "SAW", "SQUARE", "NOISE"],
    ["VCO", "LFO", "VCF", "VCA", "ENVELOPE", "DELAY", "REVERB"],
    [
      "LFO",
      "ENV",
      "RATE",
      "FREQ",
      "LFO",
      "GAIN",
      "LFO",
      "PAN",
      "A",
      "D",
      "S",
      "R",
      "MIX",
      "FB",
      "MIX",
      "SIZE"
    ]
  ];
  //widths for containers 1 slider = 30px 
  const widths = ["60px", "30px", "60px", "90px", "120px", "60px", "60px"];
  
  //get the div we're gonna be appending the UI into
  const container = document.getElementById(_div);
  
  //From here till ~line 258 it's just creating divs and appending dom elements into them
  
  //START OF PAGE SELECT
  const pageSelect = document.createElement("div");
  pageSelect.className = "pageSelect";

  let select = document.createElement("div");
  select.className = "pB";

  let selectSpan = document.createElement("span");
  selectSpan.innerHTML = labels[0][0];
  select.appendChild(selectSpan);
  pageSelect.appendChild(select);

  //END OF PAGE SELECT
  container.appendChild(pageSelect);

  //START OF editPAGE
  const editPage = document.createElement("div");
  editPage.id = "edit";

  //START OF SYNTH SELECT
  const synthSelector = document.createElement("div");
  synthSelector.className = "synthSelector";

  for (let i = 0; i < 6; i++) {
    let select = document.createElement("div");
    select.className = "sB";
    select.role = "button";
    select.tabindex = i;
    if (i == 0) {
      select.ariaPressed = "true";
      select.style.backgroundColor = "#ddd";
    }

    let selectSpan = document.createElement("span");
    selectSpan.innerHTML = labels[1][i];
    select.appendChild(selectSpan);
    synthSelector.appendChild(select);
  }

  //END OF SYNTH SELECT
  editPage.appendChild(synthSelector);

  //START OF oscSELECT
  const oscSelect = document.createElement("div");
  oscSelect.className = "oscSelect";

  const oscSelecters = document.createElement("div");
  oscSelecters.className = "oscSelecters";

  const oscSpan1 = document.createElement("span");
  oscSpan1.innerHTML = "WAVE SELECT";
  oscSelecters.appendChild(oscSpan1);
  oscSelecters.appendChild(document.createElement("br"));
  const oscSpan2 = document.createElement("span");
  oscSpan2.innerHTML = "OSC &nbsp; LFO";
  oscSelecters.appendChild(oscSpan2);
  oscSelecters.appendChild(document.createElement("br"));

  const oscSelectEl = document.createElement("select");
  oscSelectEl.name = "OSC";
  oscSelectEl.id = "OSC";
  for (let i = 0; i < 6; i++) {
    let oscSelectOption = document.createElement("option");
    if (i == 0) {
      oscSelectOption.value = "";
      oscSelectOption.selected = "true";
      oscSelectOption.disabled = "true";
      oscSelectOption.hidden = "true";
      oscSelectOption.innerHTML = "OSC";
    } else {
      oscSelectOption.value = labels[2][i - 1];
      oscSelectOption.innerHTML = labels[2][i - 1];
    }
    oscSelectEl.appendChild(oscSelectOption);
  }
  oscSelectEl.selectedIndex = parseInt(_synthData[0]) + 1;
  oscSelecters.appendChild(oscSelectEl);

  const lfoSelectEl = document.createElement("select");
  lfoSelectEl.name = "LFO";
  lfoSelectEl.id = "LFO";
  for (let i = 0; i < 6; i++) {
    let lfoSelectOption = document.createElement("option");
    if (i == 0) {
      lfoSelectOption.value = "";
      lfoSelectOption.selected = "true";
      lfoSelectOption.disabled = "true";
      lfoSelectOption.hidden = "true";
      lfoSelectOption.innerHTML = "LFO";
    } else {
      lfoSelectOption.value = labels[2][i - 1];
      lfoSelectOption.innerHTML = labels[2][i - 1];
    }
    lfoSelectEl.appendChild(lfoSelectOption);
  }
  lfoSelectEl.selectedIndex = parseInt(_synthData[1]) + 1;
  oscSelecters.appendChild(lfoSelectEl);

  //END OF SELECTERS
  oscSelect.appendChild(oscSelecters);

  //START OF SYNTH VALUE BUTTONS
  const SynthValueButtonsContainer = document.createElement("div");
  SynthValueButtonsContainer.className = "SynthValueButtonsContainer";

  const randomButton = document.createElement("button");
  randomButton.id = "randomButton";
  randomButton.innerHTML = "RANDOM VALUES";

  SynthValueButtonsContainer.appendChild(randomButton);

  const minimumButton = document.createElement("button");
  minimumButton.id = "minimumButton";
  minimumButton.innerHTML = "MINIMUM VALUES";

  SynthValueButtonsContainer.appendChild(minimumButton);

  //END OF OSC & LFO SELECT & BUTTONS
  oscSelect.appendChild(SynthValueButtonsContainer);
  editPage.appendChild(oscSelect);

  //START OF SLIDER UI
  const sliderUI = document.createElement("div");
  sliderUI.className = "sliderUI";

  //START OF LABEL CONTAINER
  const labelContainer = document.createElement("div");
  labelContainer.className = "labelContainer";

  for (let i = 0; i < 7; i++) {
    let labelDiv = document.createElement("div");
    labelDiv.style.width = widths[i];
    let labelSpan = document.createElement("span");
    labelSpan.innerHTML = labels[3][i];
    labelDiv.appendChild(labelSpan);
    labelContainer.appendChild(labelDiv);
    if (i != 6) {
      let lvl = document.createElement("div");
      lvl.className = "lvl";
      labelContainer.appendChild(lvl);
    }
  }
  //END OF LABEL CONTAINER
  sliderUI.appendChild(labelContainer);

  //START OF SUBLABEL CONTAINER
  const subLabelContainer = document.createElement("div");
  subLabelContainer.className = "subLabelContainer";

  for (let i = 0; i < 16; i++) {
    let subLabelDiv = document.createElement("div");
    subLabelDiv.style.width = "30px";
    let subLabelSpan = document.createElement("span");
    subLabelSpan.innerHTML = labels[4][i];
    subLabelDiv.appendChild(subLabelSpan);
    subLabelContainer.appendChild(subLabelDiv);
    if (i == 1 || i == 2 || i == 4 || i == 7 || i == 11 || i == 13) {
      let slvl = document.createElement("div");
      slvl.className = "slvl";
      subLabelContainer.appendChild(slvl);
    }
  }

  //END OF SUBLABEL CONTAINER
  sliderUI.appendChild(subLabelContainer);

  //START OF SLIDERS CONTAINER
  const slidersContainer = document.createElement("div");
  slidersContainer.className = "slidersContainer";
  for (let i = 1; i < 17; i++) {
    let rangeSlider = document.createElement("div");
    rangeSlider.style.width = "30px";
    let slider = document.createElement("input");
    slider.id = "slider" + i;
    slider.className = "inputRange";
    slider.orient = "vertical";
    slider.type = "range";
    slider.step = "0.01";
    slider.value = _synthData[i + 1];
    slider.min = 0;
    slider.max = 1;
    rangeSlider.appendChild(slider);
    slidersContainer.appendChild(rangeSlider);
    if (i == 2 || i == 3 || i == 5 || i == 8 || i == 12 || i == 14) {
      let vl = document.createElement("div");
      vl.className = "vl";
      slidersContainer.appendChild(vl);
    }
  }

  //END OF SLIDERS CONTAINER
  sliderUI.appendChild(slidersContainer);

  //START OF OUPUTS CONTAINER
  const outputsContainer = document.createElement("div");
  outputsContainer.className = "outputsContainer";

  for (let i = 1; i < 17; i++) {
    let rangeSliderOutput = document.createElement("div");
    rangeSliderOutput.style.width = "30px";
    let sliderOutput = document.createElement("span");
    sliderOutput.id = "sliderOutput" + i;
    sliderOutput.innerHTML = _synthData[i + 1];
    rangeSliderOutput.appendChild(sliderOutput);
    outputsContainer.appendChild(rangeSliderOutput);
    if (i == 2 || i == 3 || i == 5 || i == 8 || i == 12 || i == 14) {
      let ivl = document.createElement("div");
      ivl.className = "ivl";
      outputsContainer.appendChild(ivl);
    }
  }

  //END OF OUTPUTS CONTAINER
  sliderUI.appendChild(outputsContainer);

  //END OF SLIDER UI
  editPage.appendChild(sliderUI);

  //END OF EDIT PAGE
  container.appendChild(editPage);
}

//Update UI is used to update slider positions and the innerHTML of the outputs
//Go through all the elements and marry the _synthData with the UI 

function updateUI(_synthData) {
  for (let i = 0; i < 6; i++) {
    let div = document.getElementsByClassName("sB")[i];
    if (div.ariaPressed == "true") {
      let r = i * 18;
      for (let j = 1; j < 17; j++) {
        let s = "slider" + j.toString();
        let sO = "sliderOutput" + j.toString();
        let output = _synthData[1 + (r + j)];
        document.getElementById(s).value =
          Math.round((output + Number.EPSILON) * 100) / 100;
        document.getElementById(sO).innerHTML =
          Math.round((output + Number.EPSILON) * 100) / 100;
      }
      let oscSelect = document.getElementById("OSC");
      let oscVal = parseInt(_synthData[r]) + 1;
      if (oscVal < 0) {
        oscVal = 0;
      }
      oscSelect.selectedIndex = oscVal;

      let lfoSelect = document.getElementById("LFO");
      let lfoVal = parseInt(_synthData[r + 1]) + 1;
      if (lfoVal < 0) {
        lfoVal = 0;
      }
      lfoSelect.selectedIndex = lfoVal;
    }
  }
}

//Create the event handlers for the UI elements
function GUIInteractionSetup(_synth, _synthData) {
  let synth = _synth;
  let synthNum = synth.instruments.synths.length;

  //Event handler for selectors
  //on selector change update data
  document.getElementById("OSC").onchange = function () {
    let sel = document.getElementById("OSC");
    let index = sel.options.selectedIndex - 1;
    for (let j = 0; j < synthNum; j++) {
      if (document.getElementsByClassName("sB")[j].ariaPressed == "true") {
        let r = j * 18;
        _synthData[r] = index;
      }
    }
    _synth.updateValues();
  };

  document.getElementById("LFO").onchange = function () {
    let sel = document.getElementById("LFO");
    let index = sel.options.selectedIndex - 1;
    for (let j = 0; j < synthNum; j++) {
      if (document.getElementsByClassName("sB")[j].ariaPressed == "true") {
        let r = j * 18;
        _synthData[r + 1] = index;
      }
    }
    _synth.updateValues();
  };

  document.getElementById("randomButton").onclick = function () {
    _synth.random();
    updateUI(mySynthData);
  };

  document.getElementById("minimumButton").onclick = function () {
    _synth.minValues();
    updateUI(mySynthData);
  };

  //Event handler for each slider
  //On slider input update output text
  //Update the data array index with the slider value
  for (let i = 1; i < 17; i++) {
    let s = "slider" + i.toString();
    let sO = "sliderOutput" + i.toString();
    document.getElementById(s).oninput = function () {
      document.getElementById(sO).innerHTML = this.value;
      for (let j = 0; j < synthNum; j++) {
        if (document.getElementsByClassName("sB")[j].ariaPressed == "true") {
          let r = j * 18;
          _synthData[1 + (r + i)] = this.value;
        }
      }
      _synth.updateValues();
    };
  }

  //Event handler for each synth button
  //On click reset all the buttons to default state first
  //For the button that is pressed change background colour & update ariaPressed
  //For every slider update postition and output to corresponding data index
  for (let i = 0; i < synthNum; i++) {
    let div = document.getElementsByClassName("sB")[i];
    div.addEventListener("click", function (event) {
      for (let i = 0; i < synthNum; i++) {
        let div = document.getElementsByClassName("sB")[i];
        div.style.backgroundColor = "#fff";
        div.ariaPressed = "false";
      }
      div.style.backgroundColor = "#ddd";
      div.ariaPressed = "true";
      let r = i * 18;
      for (let j = 1; j < 17; j++) {
        let s = "slider" + j.toString();
        let sO = "sliderOutput" + j.toString();
        let output = _synthData[1 + (r + j)];
        document.getElementById(s).value =
          Math.round((output + Number.EPSILON) * 100) / 100;
        document.getElementById(sO).innerHTML =
          Math.round((output + Number.EPSILON) * 100) / 100;
      }
      let oscSelect = document.getElementById("OSC");
      let oscVal = parseInt(_synthData[r]) + 1;
      if (oscVal < 0) {
        oscVal = 0;
      }
      oscSelect.selectedIndex = oscVal;

      let lfoSelect = document.getElementById("LFO");
      let lfoVal = parseInt(_synthData[r + 1]) + 1;
      if (lfoVal < 0) {
        lfoVal = 0;
      }
      lfoSelect.selectedIndex = lfoVal;
    });
  }
}