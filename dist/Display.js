import { DisplayArea } from "./DisplayArea.js"

export class Display extends DisplayArea {

    constructor(config) {
        super()
        this.config = config
        this.card_id = "id_" + Math.random().toString(16).slice(2)
        this.parameters = {}
        this.values = {}
    }

    configureParameter(hass, starts_with, name, opt = "") {
        if (name in this.config) {
            this.parameters[name] = this.config[name];
            return this.config[name];
        }

        for (const property in hass.states) {
            if (property.startsWith(starts_with) && property.endsWith(name)) {
                this.parameters[name] = property;
                return property;
            }
        }

        if (opt == "optional") {
            return false;
        }

        throw "Parameter \"" + name + "\" nor detected nor configured.";
    }

    updateParameterValues(hass) {
        this.values = {}
        for (const [key, value] of Object.entries(this.parameters)) {
            this.values[key] = hass.states[value].state
        }
    }

    hasParameterChanged(oldHass, hass, name, entity) {
        const oldValue = oldHass.states[entity];
        const newValue = hass.states[entity];
        if (oldValue != newValue) {
            var currentdate = new Date();
            const zeroPad = (num, places) => String(num).padStart(places, '0')
            var datetime = zeroPad(currentdate.getHours(), 2) + ":"  + zeroPad(currentdate.getMinutes(), 2) + ":" + zeroPad(currentdate.getSeconds(), 2);
            console.log(datetime + " %s : %s -> %s", name,
                (typeof (oldValue) != "undefined") ? oldValue.state : "<undefined>",
                (typeof(newValue) != "undefined") ? newValue.state : "<undefined>");
            return true;
        }
        return false;
    }

    shouldUpdate(oldHass, hass) {
        for (const [name, entity] of Object.entries(this.parameters)) {
          if (this.hasParameterChanged(oldHass, hass, name, entity)) {
            return true;
          }
        }
        return false;
    }
}
