import { viewport_center } from 'Viewport.js'
import { world_map_draw } from "motor.js"

function init_keyboard_shortcuts(my_store) {
    return {
        "k": () => my_store.units[my_store.selected_unit.id].move(my_store, "N"),
        "j": () => my_store.units[my_store.selected_unit.id].move(my_store, "S"),
        "h": () => my_store.units[my_store.selected_unit.id].move(my_store, "W"),
        "l": () => my_store.units[my_store.selected_unit.id].move(my_store, "E"),
        "i": () => my_store.units[my_store.selected_unit.id].move(my_store, "NE"),
        "u": () => my_store.units[my_store.selected_unit.id].move(my_store, "NW"),
        "m": () => my_store.units[my_store.selected_unit.id].move(my_store, "SE"),
        "n": () => my_store.units[my_store.selected_unit.id].move(my_store, "SW"),

        "ArrowUp":    () => my_store.units[my_store.selected_unit.id].move(my_store, "N"),
        "ArrowDown":  () => my_store.units[my_store.selected_unit.id].move(my_store, "S"),
        "ArrowLeft":  () => my_store.units[my_store.selected_unit.id].move(my_store, "W"),
        "ArrowRight": () => my_store.units[my_store.selected_unit.id].move(my_store, "E"),
        "PageUp":     () => my_store.units[my_store.selected_unit.id].move(my_store, "NE"),
        "Home":       () => my_store.units[my_store.selected_unit.id].move(my_store, "NW"),
        "PageDown":   () => my_store.units[my_store.selected_unit.id].move(my_store, "SE"),
        "End":        () => my_store.units[my_store.selected_unit.id].move(my_store, "SW"),

        "c": function () {
            viewport_center(
                my_store,
                my_store.units[my_store.selected_unit.id].x,
                my_store.units[my_store.selected_unit.id].y
            )
        }
    }
}

const saves_list_name = 'motte-and-bailey-saves-list'
function init_ui_button_actions(window, my_store, game_state) {

    window.game_load = (id) => game_load(my_store, id)
    window.game_save = (id) => game_save(my_store, id)
    window.game_start = () => game_start(game_state)
    window.game_stop = () => game_stop(game_state)
    window.game_pause = () => game_pause(game_state)
    window.game_reset = () => game_reset()
    window.saves_list = () => saves_list()
    window.zoom_out = () => zoom_out(my_store)
    window.zoom_in = () => zoom_in(my_store)
}

function zoom_in(my_store) {
    if (my_store.world_map_zoom >= 10) {
        return false;
    }

    my_store.world_map_zoom += 1
    world_map_draw(my_store)
}

function zoom_out(my_store) {
    if (my_store.world_map_zoom <= 2) {
        return false;
    }
    my_store.world_map_zoom -= 1
    world_map_draw(my_store)
}


function saves_list() {
    const saves_list = JSON.parse(localStorage.getItem(saves_list_name))
    ui_msg(saves_list)
}

function game_load(my_store, id) {
    my_store = JSON.parse(localStorage.getItem("save_game_" + String(id)));
    ui_msg("loading " + 1, my_store)
}

function game_save(my_store, id) {
    ui_msg(my_store)
    const save_id = "save_game_" + String(id)
    localStorage.setItem(save_id, JSON.stringify(my_store))

     const saves_list = JSON.parse(localStorage.getItem(saves_list_name));
    if ( Array.isArray(saves_list) ) {
        const temp_list = new Array();
        const uniques =
            [ ...saves_list, save_id]
                .filter( function(item) {
                    if ( temp_list.indexOf(item) == -1 ) {
                        temp_list.push(item)
                        return true
                    }
                    return false
                })

        ui_msg('+++', saves_list, uniques)

        localStorage.setItem(saves_list_name, JSON.stringify(uniques))
    } else {
        localStorage.setItem(saves_list_name, JSON.stringify([save_id]))
    }
}

function game_start(game_state) {
    ui_msg("starting game")
    game_state.paused = false
}

function game_stop() {
    ui_msg("quitting game")
}

function game_pause(game_state) {
    ui_msg("pausing game")
    game_state.paused = true
}

function game_reset() {
    ui_msg("resetting game")
}

function build_units_list(container_id = "units_list") {
    const container = document.getElementById(container_id)
    if (container === undefined ) {
        throw "could not find the unit list container"
    }
}

export {
    init_keyboard_shortcuts,
    init_ui_button_actions
}
