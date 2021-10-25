function replacePlusWithSpace(string) {
    const stringWithSpace = string.replace(new RegExp("\\+","g"), ' ')
    return stringWithSpace
}

module.exports = replacePlusWithSpace