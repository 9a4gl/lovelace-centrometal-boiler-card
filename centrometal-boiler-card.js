import {
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import PelTecDisplay from "./peltec-display.js"

class LoveaceCentrometalBoilerCard extends LitElement {

  constructor() {
    super();
    this.display = new PelTecDisplay()
    this.detected = { searching: false };
  }

  parameters = [
    "peltec_state", "peltec_fire_sensor", "peltec_fan",
    "peltec_boiler_pump", "peltec_boiler_pump_demand", "peltec_electric_heater",
    "peltec_buffer_tank_temparature_up", "peltec_buffer_tank_temparature_down",
    "peltec_lambda_sensor", "peltec_tank_level", "peltec_configuration",
    "peltec_boiler_temperature", "peltec_mixer_temperature", "peltec_mixing_valve",
    "peltec_flue_gas", "peltec_active_command"];

  optional_parameters = [ "peltec_outdoor_temperature" ]

  static get properties() {
    return {
      hass: {},
      config: {},
      detected: { type: Object, reflect: true },
    };
  }

  hasParameterChanged(oldHass, parameter) {
    const oldValue = oldHass.states[this.config[parameter]];
    const newValue = this.hass.states[this.config[parameter]];
    if (oldValue != newValue) {
      console.log("%s : %s != %s", parameter, oldValue.state, newValue.state);
      return true;
    }
    return false;
  }

  shouldUpdate(changedProperties) {
    if (this.detected.searching && this.detected.hasOwnProperty("boiler_found")) {
      this.detected.searching = false
      return true;
    }
    if (changedProperties.has("config")) {
      return true;
    }
    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass");
      for (var i = 0; i < this.parameters.length; i++) {
        if (this.hasParameterChanged(oldHass, this.parameters[i])) return true;
      }
      for (var i = 0; i < this.optional_parameters.length; i++) {
        if (this.hasParameterChanged(oldHass, this.optional_parameters[i])) return true;
      };
      return false;
    }
    return false;
  }

  render() {
    if (this.detected.hasOwnProperty("boiler_found") == false) {
      this.detectBoiler();
      return html`<ha-card style="padding: 20px; text-align: center; height: auto; line-height: 30px;">Detecting Centrometal Boiler ...</ha-card>`;
    }
    if (this.detected.boiler_found == false) {
      return html`<ha-card style="padding: 20px; text-align: center; height: auto; line-height: 30px;">Centrometal Boiler not found, please configure the card manually.</ha-card>`;
    }
    return html`<ha-card><p></p>${this.display.createContent(this.hass, this.config)}</ha-card>`;
  }

  checkMissingParameters(parameters) {
    var missing = [];
    this.parameters.forEach((parameter) => {
      if (!(parameter in this.config)) {
        missing.push(parameter);
      }
    });
    return missing;
  }

  detectBoiler() {
    this.detected.searching = true;
    for (const property in this.hass.states) {
      if (property.startsWith("sensor.")) {
        var entity = property.substring(7)
        if (entity.endsWith("_boiler_state")) {
          entity = entity.substring(0, entity.length - 13)

          this.detected.boiler_found = entity;
          this.requestUpdate();
          return;
        }
      }
    }
    this.detected.boiler_found = false;
    this.requestUpdate();
    return false
  }

  setConfig(config) {
    this.config = config;
    this.style.cssText = "display: block;";
  }

  getCardSize() {
    return 6;
  }

}

customElements.define('centrometal-boiler-card', LoveaceCentrometalBoilerCard);
