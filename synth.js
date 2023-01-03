export class Synth {
  constructor() {
    this.keysElements = document.querySelectorAll('.key');
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.gain = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.destination = this.context.destination;
    this.filter = this.context.createBiquadFilter();
    this.delay = this.context.createDelay();
    this.feedback = this.context.createGain();

    this.filter.connect(this.delay);
    this.filter.connect(this.gain);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delay.connect(this.gain);
    this.gain.connect(this.destination);
    this.gain.connect(this.analyser);

    this.gain.gain.value = 0.15;
    this.analyser.fftSize = 1024;
    this.maxFilterFrequency = this.context.sampleRate / 2;
    this.filter.type = 'lowpass';
    this.delay.delayTime.value = 0;
    this.feedback.gain.value = 0;
    
    this.init();
  }

  osc = [];
  gainOsc = [];
  lfo = [];
  lfo2 = [];
  lfoGain = [];
  lfoGain2 = [];

  attack = 0.1;
  decay = 0.4;
  sustain = 0.6;
  release = 0.9;

  waveform = 'triangle';
  detune = 0;
  detuneValue = 30;
  numberOfOscs = 3;

  lfoFrequency = 0;
  lfoGainValue = 0;
  lfo2Frequency = 0;
  lfo2GainValue = 0;

  notes = {
    0: 262,
    1: 294,
    2: 311,
    3: 349,
    4: 392,
    5: 415,
    6: 466,
    7: 523,
    8: 587,
    9: 622,
    10: 698,
    11: 784,
    12: 831,
    13: 932,
    14: 1047 
  };

  keys = {
    q: 1, w: 2, e: 3, r: 4, t: 5, y: 6, u: 7, i: 8, o: 9, p: 10,
    '[': 11, ']': 12, 'a': 13, 's': 14,};

  envelopADS(frequency) {
    const now = this.context.currentTime;

    this.lfo.push(this.context.createOscillator());
    this.lfo[this.lfo.length - 1].frequency.value = this.lfoFrequency;
    this.lfoGain.push(this.context.createGain());
    this.lfoGain[this.lfoGain.length - 1].gain.value = this.lfoGainValue;
    this.lfo[this.lfo.length - 1].connect(this.lfoGain[this.lfoGain.length - 1]);

    this.lfo2.push(this.context.createOscillator());
    this.lfo2[this.lfo2.length - 1].frequency.value = this.lfo2Frequency;
    this.lfoGain2.push(this.context.createGain());
    this.lfoGain2[this.lfoGain2.length - 1].gain.value = this.lfo2GainValue;
    this.lfo2[this.lfo2.length - 1].connect(this.lfoGain2[this.lfoGain2.length - 1]);

    this.osc.push(this.context.createOscillator());
    this.gainOsc.push(this.context.createGain());

    this.osc[this.osc.length - 1].connect(this.gainOsc[this.gainOsc.length - 1]);
    this.gainOsc[this.gainOsc.length - 1].connect(this.filter);

    this.lfoGain[this.lfoGain.length - 1].connect(this.osc[this.osc.length - 1].frequency)
    this.lfoGain2[this.lfoGain2.length - 1
      ].connect(this.gainOsc[this.gainOsc.length - 1].gain)

    this.osc[this.osc.length - 1].detune.setValueAtTime(this.detune, now);
    this.osc[this.osc.length - 1].type = this.waveform;
    this.osc[this.osc.length - 1].frequency.setValueAtTime(frequency, now);

    this.osc[this.osc.length - 1].start(0);
    this.lfo[this.lfo.length - 1].start(0);
    this.lfo2[this.lfo2.length - 1].start(0);

    this.gainOsc[this.gainOsc.length - 1].gain.exponentialRampToValueAtTime(
      1, now + this.attack);
    this.gainOsc[this.gainOsc.length - 1].gain.exponentialRampToValueAtTime(
      this.sustain, now + this.decay);
  }

  envelopR(index) {
    const now = this.context.currentTime;

    this.gainOsc[index].gain.linearRampToValueAtTime(0.00001, now + this.release);
    this.osc[index].stop(now + this.release + 0.01);

    this.lfoGain[index].gain.linearRampToValueAtTime(0.00001, now + this.release);
    this.lfo[index].stop(now + this.release + 0.01);

    this.lfoGain2[index].gain.linearRampToValueAtTime(0.00001, now + this.release);
    this.lfo2[index].stop(now + this.release + 0.01);
  
    this.osc.splice(index, 1);
    this.gainOsc.splice(index, 1);
    this.lfo.splice(index, 1);
    this.lfoGain.splice(index, 1);
    this.lfo2.splice(index, 1);
    this.lfoGain2.splice(index, 1);
  }

  keyDownEvent(key) {
    let note = this.notes[key]
    for (let number = 0; number < this.numberOfOscs; number++) {
      this.envelopADS(note);
      // note = this.transpose(note, -7)
      this.detune = 
        Math.random() * (this.detuneValue - -this.detuneValue) + -this.detuneValue;
    }
    this.detune = 0;
  }

  transpose = (frequency, steps) => frequency * Math.pow(2, steps / 12);

  keyUpEvent() {
    for (let number = 0; number < this.numberOfOscs; number++) {
      this.envelopR(this.gainOsc.length - 1);
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
        this.keysElements[this.keys[event.key] - 1].onmouseup();
        this.keysElements[this.keys[event.key] - 1].classList.remove('keyActive');
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

  set Q(val) {
    this.filter.Q.value = val * 30
  }

  set lowpass(val) {
    this.filter.frequency.value = this.maxFilterFrequency * val;
  }
}
