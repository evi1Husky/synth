const oscilloscope = document.querySelector(".oscilloscope");
const lamp = document.querySelector(".lamp");

const audioCtx = new AudioContext();
const gain = audioCtx.createGain();
const analyser = audioCtx.createAnalyser();
const destination = audioCtx.destination;

gain.gain.value = 0.5
gain.connect(destination);
gain.connect(analyser);

analyser.fftSize = 1024;
oscilloscope.analyser = analyser;
oscilloscope.start();
lamp.analyser = analyser;
lamp.start();

let osc = [];
let gainOsc = [];

const keys = {a: 1, s: 2, d: 3, f: 4,};
let keyArray = []

let attack = 0.01;
let decay = 0.4;
let sustain = 0.6;
let release = 0.9;
let waveform = "triangle";
let detune = 100;

const notes = {
  0: 250.00,
  1: 270.74,
  2: 280.41,
  3: 330.42,
}

function envelopADS(frequency, waveform) {
  osc.push(audioCtx.createOscillator());
  gainOsc.push(audioCtx.createGain());
  osc[osc.length - 1].connect(gainOsc[gainOsc.length - 1]);
  gainOsc[gainOsc.length - 1].connect(gain);
  osc[osc.length - 1].detune.setValueAtTime(detune, audioCtx.currentTime);
  osc[osc.length - 1].type = waveform;
  osc[osc.length - 1].frequency.setValueAtTime(frequency, audioCtx.currentTime);
  osc[osc.length - 1].start(0);
  gainOsc[gainOsc.length - 1].gain.exponentialRampToValueAtTime(1.0,
    audioCtx.currentTime + attack);
  gainOsc[gainOsc.length - 1].gain.exponentialRampToValueAtTime(sustain,
    audioCtx.currentTime + decay
  );
}

function envelopR(index) {
  gainOsc[index].gain.linearRampToValueAtTime(0.00001,
    audioCtx.currentTime + release);
  osc[index].stop(audioCtx.currentTime + release + 0.01);
  keyArray.splice(index, 1);
  osc.splice(index, 1);
  gainOsc.splice(index, 1);
}

const keysElements = document.querySelectorAll(".key");

for (let key = 0; key < keysElements.length; key++) {
  keysElements[key].onmousedown = () => {
    envelopADS(notes[key], waveform);
  };

  keysElements[key].onmouseup = () => {
    envelopR(gainOsc.length - 1);
  };
}

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  keyArray.push(keysElements[keys[event.key] - 1]);
  keysElements[keys[event.key] - 1].onmousedown();
  keysElements[keys[event.key] - 1].classList.toggle("keyActive");
});

document.addEventListener("keyup", (event) => {
  keysElements[keys[event.key] - 1].onmouseup()
  keysElements[keys[event.key] - 1].classList.remove("keyActive");
});
