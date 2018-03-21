import { store } from 'globals.js'

const keyboard_shortcuts = {
    "k": () => store.units[store.selected_unit.id].move(store, "N"),
    "j": () => store.units[store.selected_unit.id].move(store, "S"),
    "h": () => store.units[store.selected_unit.id].move(store, "W"),
    "l": () => store.units[store.selected_unit.id].move(store, "E"),
}

export { keyboard_shortcuts }
