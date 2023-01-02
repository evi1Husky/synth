import { Synth } from './synth.js';

'use strict';

localStorage.clear();

const synth = new Synth();

const oscilloscope = document.querySelector('.oscilloscope');
oscilloscope.analyser = synth.analyser;
oscilloscope.start();

const lamp = document.querySelector('.lamp');
lamp.analyser = synth.analyser;
lamp.start();

function remapRange(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const knobAttack = document.getElementById('knobAttack');
knobAttack.value = 30;
function knobAttackEvent() {
  synth.attack = (knobAttack.currentValue / 100) / 2.7;
}
knobAttack.knobEventHandler = knobAttackEvent();
knobAttack.knobEventHandler = knobAttackEvent;

const knobDecay = document.getElementById('knobDecay');
knobDecay.value = 40;
function knobDecayEvent() {
  synth.decay = knobDecay.currentValue / 100;
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
}
knobSustain.knobEventHandler = knobSustainEvent();
knobSustain.knobEventHandler = knobSustainEvent;

const knobRelease = document.getElementById('knobRelease');
knobRelease.value = 30;
function knobReleaseEvent() {
  synth.release = remapRange(knobRelease.currentValue, 0, 100, 0, 3);
}
knobRelease.knobEventHandler = knobReleaseEvent();
knobRelease.knobEventHandler = knobReleaseEvent;

const knobGain = document.getElementById('knobGain');
knobGain.value = 43;
function knobGainEvent() {
  synth.gain.gain.value = (knobGain.currentValue / 100) / 2;
}
knobGain.knobEventHandler = knobGainEvent();
knobGain.knobEventHandler = knobGainEvent;

const knobDelay = document.getElementById('knobDelay');
knobDelay.value = 1;
function knobDelayEvent() {
  synth.delay = (knobDelay.currentValue / 100) * 100;
}
knobDelay.knobEventHandler = knobDelayEvent();
knobDelay.knobEventHandler = knobDelayEvent;

const knobDetune = document.getElementById('knobDetune');
knobDetune.value = 15;
function knobDetuneEvent() {
  const val = (knobDetune.currentValue * 2000) / 100;
  synth.detune = remapRange(val, 0, 2000, -1000, 1000);
}
knobDetune.knobEventHandler = knobDetuneEvent();
knobDetune.knobEventHandler = knobDetuneEvent;

const knobVcoNum = document.getElementById('knobVco-num');
knobVcoNum.value = 40;
function knobVcoNumEvent() {
  const val = knobVcoNum.currentValue / 20;
  synth.numberOfOscs = ~~remapRange(val, 0, 4, 1, 4);
}
knobVcoNum.knobEventHandler = knobVcoNumEvent();
knobVcoNum.knobEventHandler = knobVcoNumEvent;

const waveFormButtons = document.querySelectorAll('.wave-form-button');
waveFormButtons.forEach(button => {
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