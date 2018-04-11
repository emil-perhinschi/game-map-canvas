'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const path = require('path')
const map_defaults  = require("./../src/lib/js/map_defaults.js").map_defaults

const fs = require('fs')
const read_image_to_map = require('./../src/lib/js/map_converter.js').read_image_to_map

const map_image_path = path.resolve(
    __dirname
    + "/../assets/static/1600x1600_v2.pgm"
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
                from: "assets/static/sprites/*.png",
                to: 'sprites/',
                flatten: true
            },
            {
                from: "dist_package.json",
                to: "package.json"
            }
        ]),
        new HtmlWebpackPlugin({
            title: 'My Map v.0.1.2',
            template: path.resolve(__dirname + '/../assets/index.html'),
            inject: true,
            world_map_width:  map_defaults.world_map_width,
            world_map_height: map_defaults.world_map_height,
            full_map_width:   map_defaults.full_map_width,
            full_map_height:  map_defaults.full_map_height,
            viewport_width:  (map_defaults.viewport_width * map_defaults.tile_width),
            viewport_height: (map_defaults.viewport_height * map_defaults.tile_height)
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
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader']
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
