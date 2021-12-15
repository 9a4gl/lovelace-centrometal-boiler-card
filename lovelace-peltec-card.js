import {
  css,
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import PelTecDisplay from "./peltec-display.js"

class LoveacePelTecCard extends LitElement {
  display = new PelTecDisplay()

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("config")) {
      console.log("config changed");
      return true;
    }
    if (changedProperties.has("hass")) {
      console.log("hass changed");
      const oldHass = changedProperties.get("hass");
      this.config.entities.forEach((entityName) => {
        const oldValue = oldHass.states[entityName];
        const newValue = this.hass.states[entityName];
        if (oldValue != newValue) {
          console.log("%s : %s != %s", entityName, oldValue.state, newValue.state);
        }
      });
      return true;
      // return changedProperties.has('peltec');
    }
    console.log("unknown changed");
    return false;
  }

  render() {
    const str = this.display.createContent();
    var div = document.createElement('div');
    div.innerHTML = str.trim();
    return html`
      <ha-card>
        <div class="card-content" style="padding: 0px;">${div}</div>
      </ha-card>`;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
    this.style.cssText = "display: block; width: 100%;";
  }

  getCardSize() {
    return 6;
  }

}

//


customElements.define('lovelace-peltec-card', LoveacePelTecCard);
