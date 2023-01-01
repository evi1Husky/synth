const oscilloscope = document.querySelector(".oscilloscope");
const lamp = document.querySelector(".lamp");

const keysElements = document.querySelectorAll(".key");
const audioCtx = new AudioContext();
const gain = audioCtx.createGain();
const analyser = audioCtx.createAnalyser();
const destination = audioCtx.destination;

gain.connect(destination);
gain.connect(analyser);

analyser.fftSize = 1024;
oscilloscope.analyser = analyser;
oscilloscope.start();
lamp.analyser = analyser;
lamp.start();

let osc = [];
let gainOsc = [];

let attack = 0.1;
let decay = 0.4;
let sustain = 0.6;
let release = 0.9;

gain.gain.value = 0.18
let waveform = "triangle";
let detune = -700;
let delay = 2;
let delayRelease = 0;

let numberOfOscs = 3;

const keys = 
  {q:1, w:2, e:3, r:4, t:5, y:6, u:7, i:8, o:9, p:10, 
  "[":11, "]":12, "a":13, "s":14,};

const notes = 
  {0: 262, 1: 294, 2: 311, 3: 349, 4: 392, 5: 415, 6: 466, 7: 523,
   8: 587, 9: 622, 10: 698, 11: 784, 12: 831, 13: 932, 14: 1047}

function init(frequency) {
  osc.push(audioCtx.createOscillator());
  gainOsc.push(audioCtx.createGain());
  osc[osc.length - 1].connect(gainOsc[gainOsc.length - 1]);
  gainOsc[gainOsc.length - 1].connect(gain);
  osc[osc.length - 1].detune.setValueAtTime(detune, audioCtx.currentTime);
  osc[osc.length - 1].type = waveform;
  osc[osc.length - 1].frequency.setValueAtTime(frequency, audioCtx.currentTime);
}

function envelopADS() {
  osc[osc.length - 1].start(0);
  gainOsc[gainOsc.length - 1].gain.exponentialRampToValueAtTime(
    1.0, audioCtx.currentTime + attack);
  gainOsc[gainOsc.length - 1].gain.exponentialRampToValueAtTime(
    sustain, audioCtx.currentTime + decay
  );
}

function envelopR(index) {
  gainOsc[index].gain.linearRampToValueAtTime(
    0.00001, audioCtx.currentTime + release);
  osc[index].stop(audioCtx.currentTime + release + 0.01);
  osc.splice(index, 1);
  gainOsc.splice(index, 1);
}

function keyDownEvent(key) {
  let value = 0;
  for (let number = 0; number < numberOfOscs; number++) {
    setTimeout(() => {
      init(notes[key]);
      envelopADS();
    }, value);
    value += delay;
  }
}

function keyUpEvent() {
  let value = 0;
  for (let number = 0; number < numberOfOscs; number++) {
    setTimeout(() => {
      envelopR(gainOsc.length - 1);
    }, value);
    value += delayRelease;
  }
}

for (let key = 0; key < keysElements.length; key++) {
  keysElements[key].onmousedown = () => {
    keyDownEvent(key)
  };

  keysElements[key].onmouseup = () => {
    keyUpEvent();
  };
}

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  try {
     keysElements[keys[event.key] - 1].onmousedown();
     keysElements[keys[event.key] - 1].classList.toggle("keyActive");
  } catch (error) {
    return
  }
});

document.addEventListener("keyup", (event) => {
  try {
    setTimeout(() => {
      keysElements[keys[event.key] - 1].onmouseup()
      keysElements[keys[event.key] - 1].classList.remove("keyActive");
    }, delay);
  } catch (error) {
    return
  }
});

const hasTouchScreen = window.matchMedia('(any-pointer: coarse)').matches;

if (hasTouchScreen) {
  for (let key = 0; key < keysElements.length; key++) {
    keysElements[key].onmousedown = null;
    keysElements[key].onmouseup = null;
  }
  for (let key = 0; key < keysElements.length; key++) {
    keysElements[key].ontouchstart = () => {
      keyDownEvent(key);
    };
    keysElements[key].ontouchend = () => {
      keyUpEvent();
   };
    keysElements[key].ontouchmove = () => {
      keyUpEvent();
   };
  }
}

localStorage.clear();