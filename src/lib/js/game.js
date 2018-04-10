'use strict';

import {
    game_tick,
    world_map_draw,
    world_map_viewport_details
} from "motor.js"
import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { Town } from 'Town.js'
import { Pointer } from 'Pointer.js'
import {
    map_data,
    tile_is_walkable
} from 'mock_server_data.js'
import {
    init_keyboard_shortcuts,
    init_ui_button_actions,
    build_entities_list,
    remove_selection_mark_from_previously_selected_unit
} from 'ui.js'
import { store, game_state } from 'globals.js'
import utils from 'misc_not_mine.js'
import { now_formatted } from 'util.js'
import { viewport_center } from 'Viewport.js'

require("mini.css/dist/mini-nord.css")
require("Style/main.css")

store.tiles = init_tiles()
store.sprites = make_sprites()

window.onload = function() {
// SEEME TODO
// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
// https://developer.mozilla.org/en-US/docs/Games/Anatomy
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

    document.getElementById('map_container').focus()
    const ctx_viewport = document.getElementById('game')
                            .getContext("2d", { alpha: false })

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
    init_world_map_events(store, "world_map_canvas")



    store.redraw_all = function() {
        window.requestAnimationFrame(
            () => game_tick(ctx_viewport, store, game_state)
        )
    }

    store.redraw_all()
}


function game_loop() {

}


function init_world_map_events(store, world_map_canvas_id) {
    const canvas = document.getElementById("world_map_canvas")
    canvas.addEventListener(
            'mousedown',
            function(e) {
                const {
                    center,
                    offset,
                    viewport,
                    zoom } = world_map_viewport_details( store )

                const x = (e.pageX - canvas.offsetLeft) / store.world_map_zoom
                const y = (e.pageY - canvas.offsetTop)  / store.world_map_zoom
                ui_msg(
                    "centering on: ",
                    Math.floor(x) + offset.x,
                    Math.floor(y) + offset.y
                )


                store.pointer = new Pointer(
                    Math.floor(x) + offset.x,
                    Math.floor(y) + offset.y
                )

                viewport_center(
                    store,
                    store.pointer.x,
                    store.pointer.y
                )
                store.redraw_all()
                e.preventDefault()
                e.stopPropagation()
            },
            false
        );
}

function init_towns(my_store) {
    // interesting places
    // 712 170
    // 709 1142
    // 709 1142
    // 1202 1292
    // even better 495 1268 ?
    // best 134 876

    const towns = Array()
    towns[0] = new Town(0, 132, 877)
    towns[0].is_known(true)
    towns[1] = new Town(1, 137, 871)
    return towns;
}

function init_units(my_store) {

    const units = Array(10)
    // mock some units
    let unit_id = 0;
    let count = 0;
    while ( unit_id < units.length ) {
        const x = 120 + utils.get_random_int(30)
        const y = 860 + utils.get_random_int(30)

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

    // make some friendlies
    units[0].is_friendly(true)
    units[0].is_own(true)
    units[1].is_friendly(true)
    units[1].is_own(false)
    units[2].is_friendly(true)
    units[2].is_own(false)
    return units;
}

function keyboard_actions(my_store, game_state) {

    const move_keys = init_keyboard_shortcuts(my_store);
    return function (e) {
        if (my_store.game_state.paused === true ) {
            return false
        }

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
    const fort = new Image()
    fort.src = 'sprites/fort_topdown.png'

    const unit = new Image()
    unit.src = 'sprites/unit_topdown.png'

    const shield = new Image(64,64)
    shield.src = 'sprites/blank_shield.png'

    const cart = new Image(64,64)
    cart.src = 'sprites/small_cart.png'

    const fog_of_war = new Image()
    fog_of_war.src = 'sprites/fog_of_war.png'

    return {
        "fog_of_war": fog_of_war,
        "town": fort,
        "unit": unit,
        "shield": shield,
        "cart": cart
    }
}


function init_tiles() {

    //TODO: use a canvas element to combine image and create the final tiles
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

    const tiles = new Array()
    tiles[1] = new Array()
    tiles[1][0] = new Image()
    tiles[1][0].src = "sprites/swamp_1_dark.png"
    tiles[1][1] = new Image()
    tiles[1][1].src = "sprites/swamp_1.png"

    tiles[2] = new Array()
    tiles[2][0] = new Image()
    tiles[2][0].src = "sprites/swamp_2_dark.png"
    tiles[2][1] = new Image()
    tiles[2][1].src = "sprites/swamp_2.png"

    tiles[3] = new Array()
    tiles[3][0] = new Image()
    tiles[3][0].src = "sprites/swamp_3_dark.png"
    tiles[3][1] = new Image()
    tiles[3][1].src = "sprites/swamp_3.png"

    tiles[4] = new Array()
    tiles[4][0] = new Image()
    tiles[4][0].src = "sprites/forest_1_dark.png"
    tiles[4][1] = new Image()
    tiles[4][1].src = "sprites/forest_1.png"

    tiles[5] = new Array()
    tiles[5][0] = new Image()
    tiles[5][0].src = "sprites/forest_2_dark.png"
    tiles[5][1] = new Image()
    tiles[5][1].src = "sprites/forest_2.png"

    tiles[6] = new Array()
    tiles[6][0] = new Image()
    tiles[6][0].src = "sprites/forest_3_dark.png"
    tiles[6][1] = new Image()
    tiles[6][1].src = "sprites/forest_3.png"

    tiles[7] = new Array()
    tiles[7][0] = new Image()
    tiles[7][0].src = "sprites/lowlands_forest_topdown_dark.png"
    tiles[7][1] = new Image()
    tiles[7][1].src = "sprites/lowlands_forest_topdown.png"

    tiles[8] = new Array()
    tiles[8][0] = new Image()
    tiles[8][0].src = "sprites/lowlands_forest_topdown_tileable_dark.png"
    tiles[8][1] = new Image()
    tiles[8][1].src = "sprites/lowlands_forest_topdown_tileable.png"

    return tiles
}
