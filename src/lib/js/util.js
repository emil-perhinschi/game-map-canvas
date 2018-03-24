function now_formatted() {

    const now = new Date()
    return now.getFullYear()
        + "-" + String(now.getMonth() + 1)
        + "-" + now.getDate()
        + " "
        + " " + now.getHours()
        + ":" + now.getMinutes()
        + ":" + now.getSeconds()
}

export { now_formatted }
