import { store } from 'globals.js'
import { viewport_center } from 'Viewport.js'

const keyboard_shortcuts = {
    "k": () => store.units[store.selected_unit.id].move(store, "N"),
    "j": () => store.units[store.selected_unit.id].move(store, "S"),
    "h": () => store.units[store.selected_unit.id].move(store, "W"),
    "l": () => store.units[store.selected_unit.id].move(store, "E"),
    "i": () => store.units[store.selected_unit.id].move(store, "NE"),
    "u": () => store.units[store.selected_unit.id].move(store, "NW"),
    "m": () => store.units[store.selected_unit.id].move(store, "SE"),
    "n": () => store.units[store.selected_unit.id].move(store, "SW"),

    "ArrowUp": () => store.units[store.selected_unit.id].move(store, "N"),
    "ArrowDown": () => store.units[store.selected_unit.id].move(store, "S"),
    "ArrowLeft": () => store.units[store.selected_unit.id].move(store, "W"),
    "ArrowRight": () => store.units[store.selected_unit.id].move(store, "E"),
    "PageUp": () => store.units[store.selected_unit.id].move(store, "NE"),
    "Home": () => store.units[store.selected_unit.id].move(store, "NW"),
    "PageDown": () => store.units[store.selected_unit.id].move(store, "SE"),
    "End": () => store.units[store.selected_unit.id].move(store, "SW"),

    "c": function () {
        viewport_center(
            store,
            store.units[store.selected_unit.id].x,
            store.units[store.selected_unit.id].y
        );
    }
}

export { keyboard_shortcuts }
