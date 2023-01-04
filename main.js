import { Synth } from './synth.js';

'use strict';

localStorage.clear();

const keys =  document.querySelectorAll('.key');
const synth = new Synth(keys);

const oscilloscope = document.querySelector('.oscilloscope');
oscilloscope.analyser = synth.analyser;
oscilloscope.start();

const lamp = document.querySelector('.lamp');
lamp.analyser = synth.analyser;
lamp.start();

function remapRange(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const parameterDisplay = document.querySelector('.parameter-display');

const knobVcoNum = document.querySelector('.vco-num-knob');
knobVcoNum.value = 15;
function knobVcoNumEvent() {
  let val = ~~(knobVcoNum.currentValue / 5);
  if (val === 0) {
    val = 1;
  }
  synth.numberOfOscs = val;
  setParameterDisplay(val);
}
knobVcoNum.knobEventHandler = knobVcoNumEvent();
knobVcoNum.knobEventHandler = knobVcoNumEvent;

const knobAttack = document.getElementById('knobAttack');
knobAttack.value = 30;
function knobAttackEvent() {
  synth.attack = (knobAttack.currentValue / 100) / 2.7;
  setParameterDisplay(synth.attack.toFixed(2));
}
knobAttack.knobEventHandler = knobAttackEvent();
knobAttack.knobEventHandler = knobAttackEvent;

const knobDecay = document.getElementById('knobDecay');
knobDecay.value = 40;
function knobDecayEvent() {
  synth.decay = knobDecay.currentValue / 100;
  setParameterDisplay(synth.decay.toFixed(2));
}
knobDecay.knobEventHandler = knobDecayEvent();
knobDecay.knobEventHandler = knobDecayEvent;

const knobSustain = document.getElementById('knobSustain');
knobSustain.value = 60;
function knobSustainEvent() {
  let val = knobSustain.currentValue / 100;
  if (val === 0) {
    val = 0.01;
  }
  synth.sustain = val;
  setParameterDisplay(synth.sustain.toFixed(2));
}
knobSustain.knobEventHandler = knobSustainEvent();
knobSustain.knobEventHandler = knobSustainEvent;

const knobRelease = document.getElementById('knobRelease');
knobRelease.value = 30;
function knobReleaseEvent() {
  synth.release = remapRange(knobRelease.currentValue, 0, 100, 0, 3);
  setParameterDisplay(synth.release.toFixed(2));
}
knobRelease.knobEventHandler = knobReleaseEvent();
knobRelease.knobEventHandler = knobReleaseEvent;

const knobGain = document.getElementById('knobGain');
knobGain.value = 50;
function knobGainEvent() {
  synth.gain.gain.value = (knobGain.currentValue / 100) / 6;
  setParameterDisplay(knobGain.currentValue);
}
knobGain.knobEventHandler = knobGainEvent();
knobGain.knobEventHandler = knobGainEvent;

const knobDetune = document.getElementById('knobDetune');
knobDetune.value = 20;
function knobDetuneEvent() {
  synth.detuneValue = knobDetune.currentValue / 2;
  setParameterDisplay(synth.detuneValue.toFixed(0));
}
knobDetune.knobEventHandler = knobDetuneEvent();
knobDetune.knobEventHandler = knobDetuneEvent;

const knobDelay = document.getElementById('knobDelay');
knobDelay.value = 0;
function knobDelayEvent() {
  synth.delay.delayTime.value = (knobDelay.currentValue / 100);
  setParameterDisplay(synth.delay.delayTime.value.toFixed(2));
}
knobDelay.knobEventHandler = knobDelayEvent();
knobDelay.knobEventHandler = knobDelayEvent;

const deelayFeedback = document.getElementById('deelayFeedback');
deelayFeedback.value = 0;
function deelayFeedbackEvent() {
  synth.feedback.gain.value = (deelayFeedback.currentValue / 100);
  setParameterDisplay(synth.feedback.gain.value.toFixed(2));
}
deelayFeedback.knobEventHandler = deelayFeedbackEvent();
deelayFeedback.knobEventHandler = deelayFeedbackEvent;

const knobLowPassFrq = document.getElementById('knobLowpass');
knobLowPassFrq.value = 100;
function knobLowPassFrqEvent() {
  const val = knobLowPassFrq.currentValue / 100;
  synth.lowpass = val;
  setParameterDisplay(val);
}
knobLowPassFrq.knobEventHandler = knobLowPassFrqEvent();
knobLowPassFrq.knobEventHandler = knobLowPassFrqEvent;

const knobQ = document.getElementById('knobQ');
knobQ.value = 100;
function knobQEvent() {
  const val = knobQ.currentValue / 100;
  synth.Q = val;
  setParameterDisplay(val);
}
knobQ.knobEventHandler = knobQEvent();
knobQ.knobEventHandler = knobQEvent;

const knobLFO1 = document.getElementById("knob-lfo-1");
knobLFO1.value = 0;
function knobLFO1Event() {
  const val = (knobLFO1.currentValue / 2).toFixed(0);
  synth.lfoFrequency = val;
  setParameterDisplay(val);
}
knobLFO1.knobEventHandler = knobLFO1Event();
knobLFO1.knobEventHandler = knobLFO1Event;

const knobLFO1gain = document.getElementById("knob-lfo-1-gain");
knobLFO1gain.value = 0;
function knobLFO1gainEvent() {
  const val = (knobLFO1gain.currentValue / 2).toFixed(0);
  synth.lfoGainValue = val;
  setParameterDisplay(val);
}
knobLFO1gain.knobEventHandler = knobLFO1gainEvent();
knobLFO1gain.knobEventHandler = knobLFO1gainEvent;

const knobLFO2 = document.getElementById("knob-lfo-2");
knobLFO2.value = 0;
function knobLFO2Event() {
  const val = (knobLFO2.currentValue / 2).toFixed(0);
  synth.lfo2Frequency = val;
  setParameterDisplay(val);
}
knobLFO2.knobEventHandler = knobLFO2Event();
knobLFO2.knobEventHandler = knobLFO2Event;

const knobLFO2gain = document.getElementById("knob-lfo-2-gain");
knobLFO2gain.value = 0;
function knobLFO2gainEvent() {
  const val = (knobLFO2gain.currentValue / 100).toFixed(2);
  synth.lfo2GainValue = val;
  setParameterDisplay(val);
}
knobLFO2gain.knobEventHandler = knobLFO2gainEvent();
knobLFO2gain.knobEventHandler = knobLFO2gainEvent;

const knobTranspose = document.getElementById("transpose-knob");
knobTranspose.value = 50;
function knobTransposeEvent() {
  let val = ~~(knobTranspose.currentValue / 2.5);
  val = remapRange(val, 0, 40, -20, 20);
  synth.transposeValue = val;
  setParameterDisplay(val);
}
knobTranspose.knobEventHandler = knobTransposeEvent();
knobTranspose.knobEventHandler = knobTransposeEvent;

const waveFormButtons = document.querySelectorAll('.wave-form-button');
waveFormButtons.forEach(button => {
  if (synth.waveform === button.value) {
    button.classList.toggle('wave-form-button-active');
  }
  button.onclick = (event) => {
    button.classList.toggle('wave-form-button-active');
    synth.waveform = button.value;
    waveFormButtons.forEach(otherButton => {
      if (otherButton != event.target) {
        otherButton.classList.remove('wave-form-button-active');
      }
    });
  }
});

function setParameterDisplay(val) {
  parameterDisplay.textContent = val;
}

setParameterDisplay("");

// function rnd(min, max) {
//   return ~~(Math.random() * (max - min) + min);
// }

// function playRandom() {
//   let randomNote = rnd(0, 14);
//   let randomRelease = rnd(1, 1000);
//   keysElements[randomNote].onmousedown();
//     setTimeout(() => {
//       keysElements[randomNote].onmouseup();
//     }, randomRelease);
//   }

// let random = rnd(1000, 3000);;
// function ai() {
//   window.requestAnimationFrame(ai)
//   random += rnd(100, 700)
//   setTimeout(() => {
//     playRandom()
//   }, random);
// }

// ai()