
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
    , buildTree: function(root, data) {
        var ret = [];
        data.forEach(function(entry, index){
            if (entry.parent == root) {
                ret.push({account: entry, children: exports.alphabet.buildTree(entry.path, data)})
            }
        });
        return ret;
        
    }
}