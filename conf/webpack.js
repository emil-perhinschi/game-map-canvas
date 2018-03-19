const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const global_config  = require("./../src/lib/js/global_config.js").global_config
const fs = require('fs')
const read_image_to_map = require('./../src/lib/js/map_converter.js').read_image_to_map

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
        new HtmlWebpackPlugin({
            title: 'My Map',
            template: path.resolve(__dirname + '/../src/assets/index.html'),
            full_map_width: (global_config.full_map_width * global_config.tile_width),
            full_map_height: (global_config.full_map_height * global_config.tile_height),
            viewport_width: (global_config.viewport_width * global_config.tile_width),
            viewport_height: (global_config.viewport_height * global_config.tile_height)
        })
    ]
};

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

module.exports = [ web_config, test ]
