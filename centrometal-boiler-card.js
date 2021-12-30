import {
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { PelTecDisplay } from "./PelTec.js"
import { CmPeletDisplay } from "./CmPelet.js"

class LoveaceCentrometalBoilerCard extends LitElement {

  constructor() {
    super();
    this.display = null;
    this.configured = false;
  }

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("config")) {
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
        return new PelTecDisplay(this.config).configureDisplay(this.hass);
      case 'cmpelet':
      case 'cm_pelet':
        return new CmPeletDisplay(this.config).configureDisplay(this.hass);
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
    return html`<ha-card><p></p>${this.display.createContent(this.hass, this.config)}</ha-card>`;
  }

  setConfig(config) {
    this.config = { ...config };
    this.style.cssText = "display: block;";
  }

  getCardSize() {
    return 6;
  }

}

customElements.define('centrometal-boiler-card', LoveaceCentrometalBoilerCard);
