'use strict';

customElements.define(
  'audio-oscilloscope',
  class Oscilloscope extends HTMLElement {
    constructor() {
      const template = document.createElement('template');
      template.innerHTML = `
      <style>
      :host {
        --width: 150px;
        --height: 90px;
      }
      .oscilloscope {
        border: 1px solid #5e6573;
        border-radius: 7px;
        width: var(--width);
        height: var(--height);
        background: black;
      }
      </style>
      <canvas class="oscilloscope"></canvas>`;

      super();
      this.shadow = this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.canvas = this.shadow.querySelector('.oscilloscope');
      this.canvasContext = this.canvas.getContext('2d');
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.canvasContext.fillStyle = 'black';
      this.canvasContext.strokeStyle = 'rgb(187, 230, 230)';
      this.canvasContext.lineWidth = 2;

      this.suspended = true;
    }

    connectedCallback() {
      this.idle();
    }

    set analyser(analyserNode) {
      this.analyserNode = analyserNode;
      this.numberOfValues = this.analyserNode.frequencyBinCount;
      this.waveformData = new Uint8Array(this.numberOfValues);
    }

    idle() {
      this.suspended = true;
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(0, this.canvas.height / 2);
      this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasContext.stroke();
    }

    start() {
      this.suspended = false;
      this.draw();
    }

    draw() {
      if (this.suspended) {
        window.cancelAnimationFrame(this.draw.bind(this));
        return;
      }
      window.requestAnimationFrame(this.draw.bind(this));
      this.analyserNode.getByteTimeDomainData(this.waveformData);
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.beginPath();
      let x = 0;
      for (let i = 0; i < this.numberOfValues; i++) {
        const y = ((this.waveformData[i] / 128.0) * this.canvas.height) / 2;
        switch (i) {
        case 0:
          this.canvasContext.moveTo(x, y);
          break;
        default:
          this.canvasContext.lineTo(x, y);
          break;
        }
        x += (this.canvas.width * 1.0) / this.numberOfValues;
      }
      this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasContext.stroke();
    }

    set size([width, height]) {
      this.style.setProperty('--width', width);
      this.style.setProperty('--height', height);
    }
  }
);
