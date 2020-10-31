module.exports = (visibleLetters, string, character = '*') => {
    const array = string.split('')
    const newArray = []
    for (let i = 0; i < array.length; i++) {
        const letter = array[i]
        if (visibleLetters > i) newArray.push(letter)
        else newArray.push(character)
    }
    return newArray.join('')
}