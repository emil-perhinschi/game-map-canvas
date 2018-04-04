'use strict';

import {
    game_tick,
    world_map_draw
} from "motor.js"
import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { Town } from 'Town.js'
import { map_data, tile_is_walkable } from 'mock_server_data.js'
import {
    init_keyboard_shortcuts,
    init_ui_button_actions,
    build_entities_list
} from 'ui.js'
import { store, game_state } from 'globals.js'
import utils from 'misc_not_mine.js'
import { now_formatted } from 'util.js'

require("mini.css/dist/mini-nord.css")
require("Style/main.css")

store.sprites = make_sprites()

window.onload = function() {

// SEEME TODO
// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
// https://developer.mozilla.org/en-US/docs/Games/Anatomy

    const ctx_viewport = document.getElementById('game').getContext("2d")

    document.onkeydown = keyboard_actions(store, game_state)
    init_ui_button_actions(window, store, game_state)

    store.units = init_units(store)
    build_entities_list("units_list", store, "units", store.selected_entity.id )
    ui_msg("units generated: ", JSON.stringify(store.units))

    store.towns = init_towns(store)
    console.log(store.towns)
    build_entities_list("towns_list", store, "towns", store.selected_entity.id )
    ui_msg("towns generated: ", JSON.stringify(store.towns))

    world_map_draw(store)
    game_tick(ctx_viewport, store, game_state);

    // will get here, the next tick is called via setTimeout
    document.getElementById('map_container').focus()
}

function init_towns(my_store) {
    const towns = Array(50)
    let town_id = 0;
    let count = 0;
    while (town_id < towns.length) {
        const x = utils.get_random_int(my_store.world_map_width)
        const y = utils.get_random_int(my_store.world_map_height)
        if (tile_is_walkable(map_data, x, y).success === true) {
            towns[town_id] = new Town(town_id, x, y)
            town_id += 1
        }
        count++
        if (count > 400 ) {
            break
        }
    }
    return towns;
}

function init_units(my_store) {

    const units = Array(10)
    // mock some units
    let unit_id = 0;
    let count = 0;
    while ( unit_id < units.length ) {
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

function make_sprites() {
    const shield = new Image(64,64)
    shield.src = 'sprites/blank_shield.png'

    const cart = new Image(64,64)
    cart.src = 'sprites/small_cart.png'

    return {
        "shield": shield,
        "cart": cart
    }
}
