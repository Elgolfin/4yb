exports.Alphabet = {
  getNextEntry: function (input) {
    var lastIndexOf = input.lastIndexOf('.')
    if (lastIndexOf > -1) {
      return input.substr(0, lastIndexOf + 1) + exports.Alphabet.increments(input.substr(lastIndexOf + 1))
    } else {
      return exports.Alphabet.increments(input)
    }
  },

  getParentPath: function (input) {
    if (input === undefined || input === null) {
      return ''
    }
    return input.substring(0, input.lastIndexOf('.'))
  },

  increments: function (str) {
    if (str === null || str === '') {
      return ''
    }
    str = str.toLowerCase(str)
    var newString = ''
    var lastChar = str.charCodeAt(str.length - 1)
    lastChar++
    if (lastChar > 122) { // "z" is 122 in ascii code
      lastChar = 'a'
      if (str.length === 1) {
        newString = 'aa'
      } else {
        newString = exports.Alphabet.increments(str.substr(0, str.length - 1)) + 'a'
      }
    } else {
      newString = str.substr(0, str.length - 1) + String.fromCharCode(lastChar)
    }
    return newString
  }
}
