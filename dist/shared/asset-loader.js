"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var _ = require("lodash");
// auto-populated
exports.StringAssets = {};
exports.ObjectAssets = {};
var replaceMultiSpaces = function (string) {
    return string.replace(/ {2,}/g, ' ');
};
var JSONParser = (function () {
    function JSONParser() {
    }
    JSONParser._parseInitialArgs = function (string) {
        if (!string || _.includes(string, '#'))
            return [];
        string = replaceMultiSpaces(string);
        var split = string.split('"');
        return [split[1], split[2]];
    };
    JSONParser._parseParameters = function (baseObj, parameters) {
        if (baseObj === void 0) { baseObj = {}; }
        var paramData = _.map(parameters.split(' '), function (item) {
            var arr = item.split('=');
            var retVal = {};
            var testVal = +arr[1];
            if (!arr[0])
                return {};
            var newVal = 0;
            if (_.isNaN(testVal) && _.isUndefined(arr[1])) {
                newVal = 1;
            }
            else if (_.includes(['class', 'gender', 'link', 'expiration', 'zone', 'type'], arr[0])) {
                newVal = arr[1];
            }
            else {
                newVal = testVal;
            }
            retVal[arr[0]] = newVal;
            return retVal;
        });
        return _.reduce(paramData, function (cur, prev) {
            return _.extend({}, cur, prev);
        }, baseObj);
    };
    JSONParser.parseMonsterString = function (str) {
        if (!_.includes(str, 'level'))
            return;
        var _a = this._parseInitialArgs(str), name = _a[0], parameters = _a[1];
        if (!parameters)
            return;
        var monsterData = this._parseParameters({ name: name }, parameters);
        return monsterData;
    };
    JSONParser.parseNPCString = function (str) {
        var _a = this._parseInitialArgs(str), name = _a[0], parameters = _a[1];
        var npcData = this._parseParameters({ name: name }, parameters);
        return npcData;
    };
    JSONParser.parseItemString = function (str, type) {
        var _a = this._parseInitialArgs(str), name = _a[0], parameters = _a[1];
        if (!parameters)
            return;
        var itemData = this._parseParameters({ name: name, type: type }, parameters);
        return itemData;
    };
    JSONParser.parseFestivalString = function (str) {
        var _a = this._parseInitialArgs(str), name = _a[0], parameters = _a[1];
        if (!parameters)
            return;
        var festData = this._parseParameters({ name: name }, parameters);
        return festData;
    };
    return JSONParser;
}());
exports.JSONParser = JSONParser;
var loadDirectory = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    _.each(list, function (basefilename) {
        var filename = dir + "/" + basefilename;
        results.push({ filename: filename, type: basefilename.split('.')[0] });
    });
    return results;
};
var parseFile = function (filename) {
    var baseContents = replaceMultiSpaces(fs.readFileSync(filename, 'UTF-8')).split('\n');
    return _(baseContents).compact() /* .reject(line => _.includes(line, '#')) */.value();
};
exports.StringAssets.class = _.map(loadDirectory(__dirname + "/../core/professions"), function (_a) {
    var filename = _a.filename;
    if (_.includes(filename, '_all'))
        return;
    var split = filename.split('/');
    return split[split.length - 1].split('.')[0];
});
_.each(['events', 'strings'], function (folder) {
    _.each(loadDirectory(__dirname + "/../../assets/content/" + folder), function (_a) {
        var type = _a.type, filename = _a.filename;
        exports.StringAssets[type] = parseFile(filename);
    });
});
var parseTable = {
    items: JSONParser.parseItemString.bind(JSONParser),
    ingredients: JSONParser.parseItemString.bind(JSONParser),
    monsters: JSONParser.parseMonsterString.bind(JSONParser),
    npcs: JSONParser.parseNPCString.bind(JSONParser)
};
_.each(['items', 'ingredients', 'monsters', 'npcs'], function (folder) {
    _.each(loadDirectory(__dirname + "/../../assets/content/" + folder), function (_a) {
        var type = _a.type, filename = _a.filename;
        exports.ObjectAssets[type] = _.compact(_.map(parseFile(filename), function (line) { return parseTable[folder](line, type); }));
    });
});
