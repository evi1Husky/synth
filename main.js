import { Synth } from './synth.js';

'use strict';

localStorage.clear();

const synth = new Synth();

const oscilloscope = document.querySelector('.oscilloscope');
const lamp = document.querySelector('.lamp');

oscilloscope.analyser = synth.analyser;
oscilloscope.start();
lamp.analyser = synth.analyser;
lamp.start();


const knobDecay = document.getElementById('knobDecay');
const knobSustain = document.getElementById('knobSustain');
const knobRelease = document.getElementById('knobRelease');

const knobAttack = document.getElementById('knobAttack');
knobAttack.value = 30;
function knobAttackEvent() {
  const val = (knobAttack.currentValue / 100) / 2.7;
  synth.attack = val;
}
knobAttack.knobEventHandler = knobAttackEvent();
knobAttack.knobEventHandler = knobAttackEvent;

