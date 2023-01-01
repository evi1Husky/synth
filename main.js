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

const knobAttack = document.getElementById('knobAttack');
knobAttack.value = 56;

const knobDecay = document.getElementById('knobDecay');
knobDecay.value = 56;

const knobSustain = document.getElementById('knobSustain');
knobSustain.value = 56;

const knobRelease = document.getElementById('knobRelease');
knobRelease.value = 56;
