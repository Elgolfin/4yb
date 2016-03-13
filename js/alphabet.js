"use strict";
exports.alphabet = {
    getNextEntry: function (input) {     
        return input.substring(0, input.length - 1) + String.fromCharCode(input.charCodeAt(input.length -1 ) + 1);
    }
    , getParentPath : function(input) {
        if (input === undefined || input === null) {
            return "";
        }
        return input.substring(0,input.lastIndexOf('.'));
    }
    /*
    path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
    data = the list of the accounts (each account has a property called path which refers to its path in the tree)
    */
    , buildFlatList: function(path, data, indent) {
        var ret = [];
        indent = indent || 0;
        data.forEach(function(entry, index){
            if (entry.parent == path) {
                let txtIndent = "";
                for(let i = 0; i< indent; i++){
                    txtIndent += "&dash;&dash;"
                }
                ret.push({account: entry, indent: txtIndent});
                let children = exports.alphabet.buildFlatList(entry.path, data, indent + 1);
                children.forEach(function(entry, index) {
                    ret.push({account: entry.account, indent: entry.indent});
                });
            }
        });
        return ret;
    }
    /*
    path = the path of the account (i.e. : a, a.a, a.b.c, etc.)
    data = the list of the accounts (each account has a property called path which refers to its path in the tree)
    */
    , buildTreeList: function(path, data) {
        var ret = [];
        data.forEach(function(entry, index){
            if (entry.parent == path) {
                ret.push({account: entry, children: exports.alphabet.buildTreeList(entry.path, data)})
            }
        });
        return ret;
    }
}