'use strict';

import {
    game_tick,
    world_map_draw
} from "motor.js"
import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { map_data, tile_is_walkable } from 'mock_server_data.js'
import {
    init_keyboard_shortcuts,
    init_ui_button_actions
} from 'ui.js'
import { store, game_state } from 'globals.js'
import utils from 'misc_not_mine.js'
import { now_formatted } from 'util.js'

window.onload = function() {

// SEEME TODO
// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
// https://developer.mozilla.org/en-US/docs/Games/Anatomy

    const ctx_viewport = document.getElementById('game').getContext("2d")

    document.onkeydown = keyboard_actions(store, game_state)
    init_ui_button_actions(window, store, game_state)
    store.units = init_units(store)
    ui_msg("units generated: ", JSON.stringify(store.units))
    world_map_draw(store)
    game_tick(ctx_viewport, store, game_state);

    // will get here, the next tick is called via setTimeout
    document.getElementById('map_container').focus()
}

function init_units(my_store) {

    const units = Array(10)
    // mock some units
    let unit_id = 0;
    let count = 0;
    while ( unit_id < 10 ) {
        const x = utils.get_random_int(my_store.full_map_width)
        const y = utils.get_random_int(my_store.full_map_height)

        // only generate unit if in the low lands
        const map_check = tile_is_walkable(map_data, x, y)
        if ( map_check.success == true) {
            units[unit_id] = new Unit(unit_id, x, y)
            unit_id += 1
        }
        count++
        if (count > 400) {
            break
        }
    }

    return units;
}

function keyboard_actions(my_store, game_state) {
    return function (e) {
        if (game_state.paused === true ) {
            return false
        }

        const move_keys = init_keyboard_shortcuts(my_store);
        if (e.key in move_keys) {
            move_keys[e.key]()
            e.preventDefault()
            e.stopPropagation()
        }
    }
}

window.ui_msg = function (...args) {
    const console_el = document.getElementById('console_area')
    console_el.innerHTML =
        "<div class='messages_item'>"
        + now_formatted()
        + " "
        + args.join(" ")
        + '</div>'
        + console_el.innerHTML
}
