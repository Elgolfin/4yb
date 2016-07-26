exports.alphabet = {
  getNextEntry: function (input) {
    var lastIndexOf = input.lastIndexOf('.')
    if (lastIndexOf > -1) {
      return input.substr(0, lastIndexOf + 1) + exports.alphabet.increments(input.substr(lastIndexOf + 1))
    } else {
      return exports.alphabet.increments(input)
    }
  },
  getParentPath: function (input) {
    if (input === undefined || input === null) {
      return ''
    }
    return input.substring(0, input.lastIndexOf('.'))
  },
  /*
  path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
  data = the list of the accounts (each account has a property called path which refers to its path in the tree)
  */
  buildFlatList: function (path, data, indent) {
    var ret = []
    indent = indent || 0
    data.forEach(function (entry, index) {
      if (entry.parent === path) {
        let txtIndent = ''
        for (let i = 0; i < indent; i++) {
          txtIndent += '&dash;&dash;'
        }
        ret.push({account: entry, indent: txtIndent})
        let children = exports.alphabet.buildFlatList(entry.path, data, indent + 1)
        children.forEach(function (entry, index) {
          ret.push({account: entry.account, indent: entry.indent})
        })
      }
    })
    return ret
  },
  /*
  path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
  data = the list of the accounts (each account has a property called path which refers to its path in the tree)
  */
  buildTreeList: function (path, data) {
    var ret = []
    data.forEach(function (entry, index) {
      if (entry.parent === path) {
        ret.push({account: entry, children: exports.alphabet.buildTreeList(entry.path, data)})
      }
    })
    return ret
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
        newString = exports.alphabet.increments(str.substr(0, str.length - 1)) + 'a'
      }
    } else {
      newString = str.substr(0, str.length - 1) + String.fromCharCode(lastChar)
    }
    return newString
  }
}
