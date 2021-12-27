import {
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { PelTecDisplay } from "./peltec.js"
import { configurePelTecBoiler } from "./peltec.js"

class LoveaceCentrometalBoilerCard extends LitElement {

  constructor() {
    super();
    this.display = new PelTecDisplay()
    this.configured = false;
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

  configureBoiler() {
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
        return configurePelTecBoiler(this.config);
    }

    return "Boiler type not suppored: " + this.config["device_type"] + ".";
  }

  render() {
    if (this.configured === false) {
      var error_message = this.configureBoiler();
      this.configured = error_message === true || error_message.length == 0;
      if (!this.configured) {
        return html`<ha-card style="height: auto;"><h1 class="card-header">Centrometal Boiler Card</h1><p style="padding: 20px; line-height: 30px;">Error: ${error_message}</p></ha-card>`;
      }
      this.configured = true;
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

  setConfig(config) {
    this.config = { ...config };
    this.style.cssText = "display: block;";
  }

  getCardSize() {
    return 6;
  }

}

customElements.define('centrometal-boiler-card', LoveaceCentrometalBoilerCard);
