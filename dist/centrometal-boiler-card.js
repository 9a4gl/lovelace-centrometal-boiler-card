import {
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { PelTecDisplay } from "./PelTec.js?v=0.0.27"
import { CmPeletDisplay } from "./CmPelet.js?v=0.0.27"
import { BioTecDisplay } from "./BioTec.js?v=0.0.27"
import { BioTecPlusDisplay } from "./BioTecPlus.js?v=0.0.27"

class LovelaceCentrometalBoilerCard extends LitElement {

  constructor() {
    super();
    this.display = null;
    this.configured = false;
    this.mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (this.display != null) {
          this.display.scale_factor = entry.contentRect.height / this.display.area_height
          this.display.width = entry.contentRect.width;
          this.display.height = entry.contentRect.height;
        }
        this.width = entry.contentRect.width
        this.height = entry.contentRect.height
        // console.log("Size ", this.width, "x", this.height)
      })
    }).observe(this)
  }

  static get properties() {
    return {
      width: Number,
      height: Number,
      hass: {},
      config: {},
    };
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("height")) {
      return true;
    }
    if (changedProperties.has("hass")) {
      if (this.display === null) {
          return false
      }
      if (typeof this.display === 'string' || this.display instanceof String) {
        return false;
      }
      if (this.display != null) {
        const oldHass = changedProperties.get("hass");
        if (this.display.shouldUpdate(oldHass, this.hass)) {
          return true;
        }
      }
    }
    return false;
  }

  configureDisplay() {
    if (!("device_type" in this.config)) {
      for (const property in this.hass.states) {
        if (property.startsWith("sensor.")) {
          var entity = property.substring(7)
          if (entity.endsWith("_device_type")) {
            var prefix = entity.substring(0, entity.length - 12)
            this.config["device_type"] = this.hass.states[property].state
            break;
          }
        }
      }
    }

    if (!("device_type" in this.config)) {
      return "Centrometal boiler not found, please configure the card manually.";
    }

    switch (this.config["device_type"].toLowerCase()) {
      case 'peltec':
        return new PelTecDisplay(this).configureDisplay();
      case 'cmpelet':
      case 'cm_pelet':
        return new CmPeletDisplay(this).configureDisplay();
      case 'biotec':
        return new BioTecDisplay(this).configureDisplay();
      case 'biopl':
        return new BioTecPlusDisplay(this).configureDisplay();
      }

    return "Boiler type not suppored: " + this.config["device_type"] + ".";
  }

  render() {
    if (this.configured === false) {
      this.display = this.configureDisplay();
      if (typeof this.display === 'string' || this.display instanceof String) {
        return html`
          <ha-card style="height: auto;">
            <h1 class="card-header">Centrometal Boiler Card</h1>
            <p style="padding: 20px; line-height: 30px;">Error: ${this.display}</p></ha-card>`;
      }
      this.configured = true;
    }

    return html`<ha-card>${this.display.createContent(this.hass)}</ha-card>`;
  }

  setConfig(config) {
    this.config = { ...config };
    this.style.cssText = "display: block;";
  }

  getCardSize() {
    return 3;
  }

}

customElements.define('centrometal-boiler-card', LovelaceCentrometalBoilerCard);

console.info(
  `%c centrometal-boiler-card %c`,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
)
