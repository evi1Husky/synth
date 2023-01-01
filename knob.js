'use strict';

customElements.define(
  'control-knob',
  class Knob extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
      <style>
      :host {
        --knobColor: #0b0e12;
        --knobShadow: 0 0px 3px #242e3b inset;
        --width: 60px;
        --height: 60px;
        --dialColor: #bccae1;
        --dialHeight: 120%;
        --tickColor: #bccae1;
        --tickLength: 7px;
        --tickWidth: 1.5px;
        --ticksMarginBottom: 3px;
        }
      
      .knob {
        position: relative;
        cursor: pointer;
        width: var(--width);
        height: var(--height);
        border-radius: 50%;
        background-color: var(--knobColor);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--knobShadow)
      }
      
      .knob-dial {
        width: 100%;
        height: 3px;
        background: transparent;
        border-radius: 5px;
        transform: rotate(0deg);
      }
      
      .dial {
        position: absolute;
        width: 20%;
        height: var(--dialHeight);
        margin-left: 76%;
        border-radius: 100px;
        background: var(--dialColor);
        box-shadow:  0 0 20px 0.1px var(--dialColor);
      }
      
      .tick {
        position: absolute;
        width: var(--tickLength);
        height: var(--tickWidth);
        background-color: #3b3f48;
        border-radius: 10px;
        transform: rotate(0deg);
      }
      
      .lit-tick {
        background-color: var(--tickColor);
        box-shadow:  0 0 10px 0.1px var(--tickColor);
      }
      
      .tick-container {
        background: transparent;
        position: absolute;
        transform: rotate(125deg);
        margin-bottom: var(--ticksMarginBottom);
      }
      </style>

      <div class="knob">
        <div class="knob-dial">
          <div class="dial"></div>
        </div>
      </div>
      `;

      this.shadow = this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.knob = this.shadow.querySelector('.knob');
      this.knobDial = this.shadow.querySelector('.knob-dial');

      this.dialAngle = 125;
      this.lastX = 0;
      this.currentX = 0;
      this.minAngle = 125;
      this.maxAngle = 415;
      this.dialRotationRate = 5;
      this.knobEventHandler = null;

      this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      this.knobSize = 40;
    }

    connectedCallback() {
      this.knob.ontouchmove = (event) => {
        this.knobEvent(~~event.touches[0].clientX);
        if (this.knobEventHandler) {
          this.knobEventHandler();
        }
      };

      this.knob.onmousedown = () => {
        this.knob.style.cursor = 'grabbing';
        window.onmousemove = (event) => {
          this.knobEvent(event.x);
          if (this.knobEventHandler) {
            this.knobEventHandler();
          }
        };
      };

      window.onmouseup = () => {
        this.knob.style.cursor = 'pointer';
        window.onmousemove = null;
      };
    }

    knobEvent(x) {
      this.lastX = x;
      if (this.lastX > this.currentX) {
        this.rotateRight(x);
      } else if (this.lastX < this.currentX) {
        this.rotateLeft(x);
      }
    }

    rotateRight(x) {
      if (this.dialAngle <= this.maxAngle) {
        if (this.dialAngle > this.maxAngle - 5) {
          this.dialRotationRate = 1;
        } else {
          this.dialRotationRate = 5;
        }
        this.dialAngle += this.dialRotationRate;
        this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
        this.currentX = x;
      }
    }

    rotateLeft(x) {
      if (this.dialAngle >= this.minAngle) {
        if (this.dialAngle < this.minAngle + 5) {
          this.dialRotationRate = 1;
        } else {
          this.dialRotationRate = 5;
        }
        this.dialAngle -= this.dialRotationRate;
        this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
        this.currentX = x;
      }
    }


    get currentValue() {
      let knobValuePercent = Math.floor(((this.dialAngle - 125) * 143) / 415);
      if (knobValuePercent < 0) {
        knobValuePercent = 0;
      } else if (knobValuePercent >= 99) {
        knobValuePercent = 100;
      }
      return knobValuePercent;
    }

    set value(percent) {
      if (percent >= 0 && percent <= 100) {
        this.dialAngle =
          ((this.maxAngle - this.minAngle) / 99) * percent + this.minAngle;
        this.knobDial.style.transform = `rotate(${this.dialAngle}deg)`;
      }
      if (percent === 100) {
        this.dialAngle = this.maxAngle - 1;
        this.knobDial.style.transform = `rotate(${this.maxAngle - 1}deg)`;
      }
    }

    set knobColor(value) {
      this.style.setProperty('--knobColor', value);
    }

    set knobShadow(value) {
      this.style.setProperty('--knobShadow', value);
    }

    set knobSize(value) {
      this.style.setProperty('--width', `${value}px`);
      this.style.setProperty('--height', `${value}px`);
      this.style.setProperty('--dialHeight', `${value + 30}%`);
    }

    set lightColor(value) {
      this.style.setProperty('--dialColor', value);
      this.style.setProperty('--tickColor', value);
    }
  }
);
