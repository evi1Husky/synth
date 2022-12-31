"use strict";

customElements.define(
  "signal-lamp",
  class Lamp extends HTMLElement {
    constructor() {
      const template = document.createElement("template");
      template.innerHTML = `
      <style>
      :host {
        display: flex;
        --width: 25px;
        --height: 25px;
        --alpha: 0.07;
        --R: 214;
        --G: 229;
        --B: 255;
      }
      .lamp {
        width: var(--width);
        height: var(--height);
        border-radius: 50%;
        border: 1px solid #2b2d35ae;
        will-change: background-color;
        background-color: rgba(var(--R), var(--G), var(--B), var(--alpha));
        box-shadow: inset 0px 0px 10px rgba(0,0,0,0.9);
        will-change: filter;
        filter: drop-shadow(
          0 0 17px rgba(var(--R), var(--G), var(--B), calc(var(--alpha) - 0.1)));
      }
      </style>
      <div class="lamp"></div>`;

      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.lamp = this.shadow.querySelector(".lamp");
    }

    connectedCallback() {
      this.idle();
    }

    set analyser(analyserNode) {
      this.analyserNode = analyserNode;
      this.numberOfValues = this.analyserNode.frequencyBinCount;
      this.waveformData = new Uint8Array(this.numberOfValues);
      this.length = this.waveformData.length;
    }

    idle() {
      this.suspended = true;
      this.style.setProperty("--alpha", 0.07);
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

      this.analyserNode.getByteFrequencyData(this.waveformData);

      const val = this.waveformData[Math.floor(Math.random() * this.length)];
      const map = val / 255;
      const out = map * 1.2;
      this.style.setProperty("--alpha", out);
    }

    setColor(...RGB) {
      this.style.setProperty("--R", RGB[0]);
      this.style.setProperty("--G", RGB[1]);
      this.style.setProperty("--B", RGB[2]);
    }

    set size(value) {
      this.style.setProperty("--width", `${value}px`);
      this.style.setProperty("--height", `${value}px`);
    }
  }
);
