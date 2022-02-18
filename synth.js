function synth(_maxiInstruments, _synthData) {
  //Set Global Constants
  this.instruments = _maxiInstruments;
  this.numberOfSynths = 6;
  this.octaveOffset = 0;

  //Initialise maxiInstruments Instances
  this.start = (_divID) => {
    this.div = _divID;
    this.instruments.guiElement = document.getElementById(this.div);
    this.instruments
      .loadModules()
      .then(() => {
        for (i = 0; i < this.numberOfSynths; i++) {
          this.synth = instruments.addSynth();
          this.synth.mapped = [
            "oscFn",
            "lfoOscFn",
            "gain",
            "pan",
            "attack",
            "decay",
            "sustain",
            "release",
            "lfoFrequency",
            "lfoPitchMod",
            "lfoFilterMod",
            "lfoAmpMod",
            "adsrPitchMod",
            "cutoff",
            "reverbMix",
            "roomSize",
            "delay",
            "delayMix"
          ];
        }

        document.addEventListener("keydown", this.logKeyPress);
        document.addEventListener("keyup", this.logKeyRelease);

        this.random();
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  //generate random integer between 2 values
  this.getRandomInt = (_min, _max) => {
    this.min = Math.ceil(_min);
    this.max = Math.floor(_max);

    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  };

  //Scale function in p5 / openFrameworks format
  this.mapScale = (value, min1, max1, min2, max2) => {
    return Math.floor(min2 + ((value - min1) * (max2 - min2)) / (max1 - min1));
  };

  //Generate random values for each maxiInstruments instance and parameter
  this.random = () => {
    this.step =
      this.instruments.getMappedOutputs().length / this.numberOfSynths;

    //Generate floats for every parameter
    for (i = 0; i < this.instruments.getMappedOutputs().length; i++) {
      _synthData[i] = Math.round((Math.random() + Number.EPSILON) * 100) / 100;
    }
    //Generate Int for each OSC
    for (
      i = 0;
      i < this.instruments.getMappedOutputs().length;
      i += this.step
    ) {
      _synthData[i] = this.getRandomInt(0, 4);
    }
    //Generate Int for each LFO
    for (
      let i = 1;
      i < this.instruments.getMappedOutputs().length;
      i += this.step
    ) {
      _synthData[i] = this.getRandomInt(0, 4);
    }
	//update synth with new random parameters
    this.instruments.updateMappedOutputs(_synthData);
  };

  //Set synth values to minimum
  this.minValues = () => {
    for (i = 0; i < this.instruments.getMappedOutputs().length; i++) {
      _synthData[i] = 0;
    }
    this.instruments.updateMappedOutputs(_synthData);
  };

  //Push global array into synth values
  //Mapping global array to synth array manually
  //Do it once and forget about it, if maxiInstruments ever changes this will need changing
  this.updateValues = () => {
    this.newData = [];
    for (i = 0; i < this.instruments.synths.length; i++) {
      let r = i * 18;
      this.newData[0 + r] = _synthData[0 + r];
      this.newData[1 + r] = _synthData[2 + r];
      this.newData[2 + r] = _synthData[7 + r];
      this.newData[3 + r] = _synthData[9 + r];
      this.newData[4 + r] = _synthData[10 + r];
      this.newData[5 + r] = _synthData[11 + r];
      this.newData[6 + r] = _synthData[12 + r];
      this.newData[7 + r] = _synthData[13 + r];
      this.newData[8 + r] = _synthData[4 + r];
      this.newData[9 + r] = _synthData[2 + r];
      this.newData[10 + r] = _synthData[6 + r];
      this.newData[11 + r] = _synthData[8 + r];
      this.newData[12 + r] = _synthData[3 + r];
      this.newData[13 + r] = _synthData[5 + r];
      this.newData[14 + r] = _synthData[16 + r];
      this.newData[15 + r] = _synthData[17 + r];
      this.newData[16 + r] = _synthData[15 + r];
      this.newData[17 + r] = _synthData[14 + r];
    }
    this.instruments.updateMappedOutputs(this.newData);
  };

  //Trigger synth note on QWERTY
  //Only trigger if event isn't repeat
  this.logKeyPress = (e) => {
    if (!event.repeat) {
      switch (e.code) {
        case "KeyZ":
          //Down Octave
          if (this.octaveOffset > -48) {
            this.octaveOffset -= 12;
          }
          break;
        case "KeyX":
          //Down Octave
          if (this.octaveOffset < 48) {
            this.octaveOffset += 12;
          }
          break;
        case "KeyA":
          //C
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 60);
            this.instruments.synths[i].noteon(this.octaveOffset + 60);
          }
          break;
        case "KeyW":
          //C#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 61);
            this.instruments.synths[i].noteon(this.octaveOffset + 61);
          }
          break;
        case "KeyS":
          //D
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 62);
            this.instruments.synths[i].noteon(this.octaveOffset + 62);
          }
          break;
        case "KeyE":
          //E
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 63);
            this.instruments.synths[i].noteon(this.octaveOffset + 63);
          }
          break;
        case "KeyD":
          //D
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 64);
            this.instruments.synths[i].noteon(this.octaveOffset + 64);
          }
          break;
        case "KeyF":
          //F
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 65);
            this.instruments.synths[i].noteon(this.octaveOffset + 65);
          }
          break;
        case "KeyT":
          //F#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 66);
            this.instruments.synths[i].noteon(this.octaveOffset + 66);
          }
          break;
        case "KeyG":
          //G
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 67);
            this.instruments.synths[i].noteon(this.octaveOffset + 67);
          }
          break;
        case "KeyY":
          //G#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 68);
            this.instruments.synths[i].noteon(this.octaveOffset + 68);
          }
          break;
        case "KeyH":
          //A
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 69);
            this.instruments.synths[i].noteon(this.octaveOffset + 69);
          }
          break;
        case "KeyU":
          //A#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 70);
            this.instruments.synths[i].noteon(this.octaveOffset + 70);
          }
          break;
        case "KeyJ":
          //B
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 71);
            this.instruments.synths[i].noteon(this.octaveOffset + 71);
          }
          break;
        case "KeyK":
          //C
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 72);
            this.instruments.synths[i].noteon(this.octaveOffset + 72);
          }
          break;
        case "KeyO":
          //C#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 73);
            this.instruments.synths[i].noteon(this.octaveOffset + 73);
          }
          break;
        case "KeyL":
          //D
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 74);
            this.instruments.synths[i].noteon(this.octaveOffset + 74);
          }
          break;
        case "KeyP":
          //D#
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 75);
            this.instruments.synths[i].noteon(this.octaveOffset + 75);
          }
          break;
        case "Semicolon":
          //E
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 76);
            this.instruments.synths[i].noteon(this.octaveOffset + 76);
          }
          break;
        case "Quote":
          //F
          for (i = 0; i < this.instruments.synths.length; i++) {
            this.instruments.synths[i].noteoff(this.octaveOffset + 77);
            this.instruments.synths[i].noteon(this.octaveOffset + 77);
          }
          break;
      }
    }
  };

  //Trigger note off
  this.logKeyRelease = (e) => {
    switch (e.code) {
      case "KeyA":
        //C
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 60);
        }
        break;
      case "KeyW":
        //C#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 61);
        }
        break;
      case "KeyS":
        //D
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 62);
        }
        break;
      case "KeyE":
        //D#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 63);
        }
        break;
      case "KeyD":
        //E
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 64);
        }
        break;
      case "KeyF":
        //F
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 65);
        }
        break;
      case "KeyT":
        //F#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 66);
        }
        break;
      case "KeyG":
        //G
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 67);
        }
        break;
      case "KeyY":
        //G#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 68);
        }
        break;
      case "KeyH":
        //A
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 69);
        }
        break;
      case "KeyU":
        //A#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 70);
        }
        break;
      case "KeyJ":
        //B
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 71);
        }
        break;
      case "KeyK":
        //C
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 72);
        }
        break;
      case "KeyO":
        //C#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 73);
        }
        break;
      case "KeyL":
        //D
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 74);
        }
        break;
      case "KeyP":
        //D#
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 75);
        }
        break;
      case "Semicolon":
        //E
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 76);
        }
        break;
      case "Quote":
        //F
        for (i = 0; i < this.instruments.synths.length; i++) {
          this.instruments.synths[i].noteoff(this.octaveOffset + 77);
        }
        break;
    }
  };
  //END
}