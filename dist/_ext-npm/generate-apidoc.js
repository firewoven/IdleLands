"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fs = require("fs");
var docString = "\n# IdleLands API\n\nTo connect to IdleLands via the API, you must connect using a websocket connection using the Primus library. Currently it uses a standard websocket.\n";
var normalizedPath = require('path').join(__dirname, '..');
var getAllSocketFunctions = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    _.each(list, function (basefilename) {
        var filename = dir + "/" + basefilename;
        var stat = fs.statSync(filename);
        if (stat && stat.isDirectory())
            results = results.concat(getAllSocketFunctions(filename));
        else if (_.includes(basefilename, '.socket'))
            results.push(filename);
    });
    return results;
};
var allSocketFunctions = getAllSocketFunctions(normalizedPath);
var allSocketRequires = _.map(allSocketFunctions, require);
docString += '\n\n';
docString += 'API Call | Arguments | Description\n';
docString += '-------- | --------- | -----------\n';
_.each(allSocketRequires, function (obj) {
    docString += obj.event + " | " + obj.args + " | " + obj.description + "\n";
});
fs.writeFileSync('docs/API.md', docString);
