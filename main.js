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

const knob = document.getElementById('knob');
knob.value = 56;