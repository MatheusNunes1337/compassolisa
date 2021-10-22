function replacePlusWithSpace(string) {
    const stringWithSpace = string.replace(new RegExp("\\+","g"), ' ')
    console.log(stringWithSpace)
    return stringWithSpace
}

module.exports = replacePlusWithSpace