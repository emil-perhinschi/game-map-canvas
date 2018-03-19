const fs = require('fs');

function read_image_to_map(map_image_path) {

    let lines = fs.readFileSync(
        map_image_path,
        'ascii'
    )
    .split("\n");

    const type = lines.shift()
    if (type != "P2") {
        throw "File is not PGM"
    }
    lines.shift() // remove empty lines or comments
    const size = lines.shift().split(" ")
    console.log("size: ", size)
    const max_value = lines.shift()
    console.log("max value: ", max_value)
    if ( lines[-1] == null) {
        lines.pop()
        console.log("last empty element was null")
    }

    // normalize from 0 to 16
    const normal_min = 0;
    const normal_max = 16;

    const normalized_values = normalize_values(lines, normal_min, normal_max);

    let map_data = new Array()
    while ( normalized_values.length > 0 ) {
        map_data.push(normalized_values.splice(0, 400))
    }
    console.log("map length: ", map_data.length)

    return map_data
}



function normalize_int (
    item,
    actual_max_value, actual_min_value,
    normal_min, normal_max) {

    if ( normal_min === normal_max ) {
        console.log(normal_min, normal_max)
        throw " the normal min and max values are equal"
    }
    // http://mathforum.org/library/drmath/view/60433.html
    // 1 + (x-A)*(10-1)/(B-A)
    return Math.floor(
        normal_min +
            (item - actual_min_value)
            * (normal_max - normal_min)
            / (actual_max_value - actual_min_value)
    )
}

function normalize_values ( input_array, normal_min, normal_max ) {

    let actual_max_value = 0;
    let actual_min_value = 0;
    input_array.map(
        function(item) {
            const item_int = parseInt(item)
            actual_max_value =
                item_int > actual_max_value
                ? item_int : actual_max_value
            actual_min_value =
                item_int < actual_min_value
                ? item_int : actual_min_value
        }
    )

    return input_array.map(
        function(item) {
            return normalize_int(
                parseInt(item),
                actual_max_value,
                actual_min_value,
                normal_min,
                normal_max
            )
        }
    )
}

module.exports.read_image_to_map = read_image_to_map
