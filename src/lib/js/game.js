'use strict';

const game_tick = require("motor.js").game_tick

import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { map_data, tile_is_walkable } from 'mock_server_data.js'
import { init_keyboard_shortcuts } from 'keyboard_shortcuts.js'
import { store } from 'globals.js'
import utils from 'misc_not_mine.js'



window.onload = function() {

    const ctx_viewport = document.getElementById('game').getContext("2d")
    document.getElementById('map_container').focus()

    document.onkeydown = keyboard_actions(store)

    store.units = init_units(store)
    console.log("units generated: ", store.units)

    game_tick(ctx_viewport, store);
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

function keyboard_actions(my_store) {
    return function (e) {
        const move_keys = init_keyboard_shortcuts(my_store);
        if (e.key in move_keys) {
            move_keys[e.key]()
            e.preventDefault()
            e.stopPropagation()
        }
    }
}
