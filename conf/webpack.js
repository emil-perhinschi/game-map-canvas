'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const store  = require("./../src/lib/js/globals.js").store
const fs = require('fs')
const read_image_to_map = require('./../src/lib/js/map_converter.js').read_image_to_map

const map_image_path = path.resolve(
    __dirname
    + "/../src/assets/static/1600x1600_v2.pgm"
)

const map_data = read_image_to_map(
    map_image_path,
    1600 // world_map_width ... don't care about the height, only about how long is each row
)

fs.writeFile(
    path.resolve(__dirname + "/../src/lib/js/game_world_map.json"),
    JSON.stringify(map_data),
    "ascii",
    (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    }
)

const web_config = {
    entry: path.resolve(__dirname + '/../src/lib/js/game.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname + '/../dist')
    },
    resolve: {
        alias: {
            Style: path.resolve(__dirname + "/../src/lib/style"),
        },
        modules: [
            path.resolve(__dirname + "/../src/lib/js"),
            "node_modules"
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "src/assets/static/sprites/*.png",
                to: 'sprites/',
                flatten: true
            }
        ]),
        new HtmlWebpackPlugin({
            title: 'My Map v.0.1.2',
            template: path.resolve(__dirname + '/../src/assets/index.html'),
            world_map_width:  store.world_map_width,
            world_map_height: store.world_map_height,
            full_map_width:  store.full_map_width,
            full_map_height: store.full_map_height,
            viewport_width:  (store.viewport_width * store.tile_width),
            viewport_height: (store.viewport_height * store.tile_height)
        })
    ],
    module: {
        rules: [
            {
                test:/\.css$/,
                use:[
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test:/\.scss$/,
                use:['style-loader','css-loader', 'sass-loader']
            }
        ]
    }
}

const test = {
    target: "node",
    entry: path.resolve( __dirname + '/../tests/convert_image_to_array.js' ),
    output: {
        filename: 'test_image_converter.js',
        path: path.resolve(__dirname + '/../dist')
    },
    resolve: {
        modules: [
            path.resolve(__dirname + "/../src/lib/js"),
            "node_modules"
        ]
    },
}

module.exports = [ web_config , test]
