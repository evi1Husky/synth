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

const knobAttack = document.getElementById('knobAttack');
knobAttack.value = 30;
function knobAttackEvent() {
  const val = (knobAttack.currentValue / 100) / 2.7;
  synth.attack = val;
  console.log(`attack: ${synth.attack}`)
}
knobAttack.knobEventHandler = knobAttackEvent();
knobAttack.knobEventHandler = knobAttackEvent;

const knobDecay = document.getElementById('knobDecay');
knobDecay.value = 40;
function knobDecayEvent() {
  const val = (knobDecay.currentValue / 100);
  synth.decay = val;
  console.log(`decay: ${synth.decay}`);
}
knobDecay.knobEventHandler = knobDecayEvent();
knobDecay.knobEventHandler = knobDecayEvent;

const knobSustain = document.getElementById('knobSustain');
knobSustain.value = 60;
function knobSustainEvent() {
  const val = (knobSustain.currentValue / 100);
  if (val === 0) {
    val = 0.01;
  }
  synth.sustain = val;
  console.log(`sustain: ${synth.sustain}`);
}
knobSustain.knobEventHandler = knobSustainEvent();
knobSustain.knobEventHandler = knobSustainEvent;

const knobRelease = document.getElementById('knobRelease');
knobRelease.value = 30;
function knobReleaseEvent() {
  const val = (knobRelease.currentValue)
  synth.release = remapRange(val, 0, 100, 0, 3);
  console.log(`release: ${synth.release}`);
}
knobRelease.knobEventHandler = knobReleaseEvent();
knobRelease.knobEventHandler = knobReleaseEvent;

function remapRange(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
