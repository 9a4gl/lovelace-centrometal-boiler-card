import { DisplayArea } from "./DisplayArea.js?v=0.0.27"

export class Display extends DisplayArea {

    constructor(card, posx, posy, width, height) {
        super(posx, posy, width, height, card.mobile)
        this.card = card
        this.config = card.config
        this.parameters = {}
        this.values = {}
        this.values_if_missing = {}
        this.card_id = "id_" + Math.random().toString(16).slice(2)
        this.prefix = ""
        if ("prefix" in this.config) {
            this.prefix = this.config["prefix"]
            if (this.prefix.endsWith("_") == false) {
                this.prefix = this.prefix + "_"
            }
        }
    }

    configureParameter(starts_with, name, opt = "", value_if_missing = null) {
        if (this.prefix !== "") {
            starts_with = starts_with.replace(".", "." + this.prefix)
        }
        var alternative_name = null
        if (name.includes("|")) {
            const array = name.split("|")
            name = array[0]
            alternative_name = array[1]
        }
        if (name in this.config) {
            this.parameters[name] = this.config[name];
            return this.config[name];
        }
        if (alternative_name in this.config) {
            this.parameters[name] = this.config[alternative_name];
            return this.config[name];
        }
        for (const property in this.card.hass.states) {
            if (property.startsWith(starts_with) && property.endsWith(name)) {
                this.parameters[name] = property;
                return property;
            }
        }
        for (const property in this.card.hass.states) {
            if (property.startsWith(starts_with) && property.endsWith(alternative_name)) {
                this.parameters[name] = property;
                return property;
            }
        }

        if (opt == "optional") {
            if (value_if_missing != null) {
                // Optional value, but if does not exist use provided "missing" value
                this.values_if_missing[name] = value_if_missing
                return true
            }
            return false;
        }

        throw "Parameter \"" + name + "\" nor detected nor configured.";
    }

    updateParameterValues(hass) {
        this.values = {}
        for (const [key, value] of Object.entries(this.parameters)) {
            this.values[key] = hass.states[value].state
            if (this.values[key] == "unavailable") {
                this.values[key] = "-"
            }
        }
        // Add values for optional parameters that has value if missing
        for (const [key, value] of Object.entries(this.values_if_missing)) {
            this.values[key] = value
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

    formatTemperature(parameter, default_value = "--", max_value = 145) {
        return ((parameter in this.values) && (this.values[parameter] > -45) && (this.values[parameter] < max_value)) ? this.values[parameter] : default_value
    }
}
