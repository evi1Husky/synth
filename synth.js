export class Synth {
  constructor() {
    this.keysElements = document.querySelectorAll('.key');
    this.audioCtx = new AudioContext();
    this.gain = this.audioCtx.createGain();
    this.analyser = this.audioCtx.createAnalyser();
    this.destination = this.audioCtx.destination;

    this.gain.connect(this.destination);
    this.gain.connect(this.analyser);

    this.gain.gain.value = 0.15;
    this.analyser.fftSize = 1024;

    this.init();
  }

  osc = [];
  gainOsc = [];

  attack = 0.1;
  decay = 0.4;
  sustain = 0.6;
  release = 0.9;

  waveform = 'triangle';
  detune = 0;
  detuneValue = 30;
  delay = 0;

  numberOfOscs = 4;

  notes = {
    0: 262, 1: 294, 2: 311, 3: 349, 4: 392, 5: 415, 6: 466, 7: 523,
    8: 587, 9: 622, 10: 698, 11: 784, 12: 831, 13: 932, 14: 1047 };

  keys = {
    q: 1, w: 2, e: 3, r: 4, t: 5, y: 6, u: 7, i: 8, o: 9, p: 10,
    '[': 11, ']': 12, 'a': 13, 's': 14,};

  createOsc(frequency) {
    this.osc.push(this.audioCtx.createOscillator());
    this.gainOsc.push(this.audioCtx.createGain());
    this.osc[this.osc.length - 1].connect(this.gainOsc[this.gainOsc.length - 1]);
    this.gainOsc[this.gainOsc.length - 1].connect(this.gain);
    this.osc[this.osc.length - 1].detune.setValueAtTime(this.detune, 
      this.audioCtx.currentTime);
    this.osc[this.osc.length - 1].type = this.waveform;
    this.osc[this.osc.length - 1].frequency.setValueAtTime(frequency, 
      this.audioCtx.currentTime);
  }

  envelopADS() {
    this.osc[this.osc.length - 1].start(0);
    this.gainOsc[this.gainOsc.length - 1].gain.exponentialRampToValueAtTime(
      1, this.audioCtx.currentTime + this.attack);
    this.gainOsc[this.gainOsc.length - 1].gain.exponentialRampToValueAtTime(
      this.sustain, this.audioCtx.currentTime + this.decay
    );
  }

  envelopR(index) {
    this.gainOsc[index].gain.linearRampToValueAtTime(
      0.00001, this.audioCtx.currentTime + this.release);
    this.osc[index].stop(this.audioCtx.currentTime + this.release + 0.01);
    this.osc.splice(index, 1);
    this.gainOsc.splice(index, 1);
  }

  keyDownEvent(key) {
    let value = 0;
    for (let number = 0; number < this.numberOfOscs; number++) {
      setTimeout(() => {
        this.detune = 
          Math.random() * (this.detuneValue - -this.detuneValue) + -this.detuneValue;
        this.createOsc(this.notes[key]);
        this.envelopADS();
      }, value);
      value += this.delay;
    }
  }

  keyUpEvent() {
    let value = 0;
    for (let number = 0; number < this.numberOfOscs; number++) {
      setTimeout(() => {
        this.envelopR(this.gainOsc.length - 1);
      }, value);
      value += this.delay;
    }
  }

  init() {
    for (let key = 0; key < this.keysElements.length; key++) {
      this.keysElements[key].onmousedown = () => {
        this.keyDownEvent(key);
      };

      this.keysElements[key].onmouseup = () => {
        this.keyUpEvent();
      };
    }

    document.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      try {
        this.keysElements[this.keys[event.key] - 1].onmousedown();
        this.keysElements[this.keys[event.key] - 1].classList.toggle('keyActive');
      } catch (error) {
        return;
      }
    });

    document.addEventListener('keyup', (event) => {
      try {
        setTimeout(() => {
          this.keysElements[this.keys[event.key] - 1].onmouseup();
          this.keysElements[this.keys[event.key] - 1].classList.remove('keyActive');
        }, this.delay);
      } catch (error) {
        return;
      }
    });

    const hasTouchScreen = window.matchMedia('(any-pointer: coarse)').matches;

    if (hasTouchScreen) {
      for (let key = 0; key < this.keysElements.length; key++) {
        this.keysElements[key].onmousedown = null;
        this.keysElements[key].onmouseup = null;
      }
      for (let key = 0; key < this.keysElements.length; key++) {
        this.keysElements[key].ontouchstart = () => {
          this.keyDownEvent(key);
        };
        this.keysElements[key].ontouchend = () => {
          this.keyUpEvent();
        };
        this.keysElements[key].ontouchmove = () => {
          this.keyUpEvent();
        };
      }
    }
  }
}
