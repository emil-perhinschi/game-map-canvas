const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const global_config  = require("./../src/lib/js/global_config.js").global_config

module.exports = {
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
