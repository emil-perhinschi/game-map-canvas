const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const store  = require("./../src/lib/js/globals.js").store
const fs = require('fs')
const read_image_to_map = require('./../src/lib/js/map_converter.js').read_image_to_map
const sprites = require('./../src/lib/js/sprites.js').sprites

const map_image_path = path.resolve(
    __dirname
    + "/../src/assets/static/400x400_v2.pgm"
)

const map_data = read_image_to_map(map_image_path)
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
        modules: [
            path.resolve(__dirname + "/../src/lib/js"),
            "node_modules"
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: "src/assets/static/sprites/*.png",
                to: 'icons/',
                flatten: true
            }
        ]),
        new HtmlWebpackPlugin({
            title: 'My Map v.0.1.2',
            template: path.resolve(__dirname + '/../src/assets/index.html'),
            world_map_width:  store.world_map_width,
            world_map_height: store.world_map_height,
            viewport_width:  (store.viewport_width * store.tile_width),
            viewport_height: (store.viewport_height * store.tile_height)
        })
    ]
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
