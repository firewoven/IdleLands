"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fs = require("fs");
var stat_calculator_1 = require("../shared/stat-calculator");
var docString = "\n# IdleLands Equipment Effects\n";
docString += '\n\n';
docString += '## Special Stats\n\n';
docString += 'Name | Description\n';
docString += '---- | -----------\n';
_.each(stat_calculator_1.SPECIAL_STATS_BASE, function (_a) {
    var name = _a.name, desc = _a.desc;
    docString += name + " | " + desc + "\n";
});
docString += '\n\n';
docString += '## Attack Stats\n\n';
docString += 'Name | Description\n';
docString += '---- | -----------\n';
_.each(stat_calculator_1.ATTACK_STATS_BASE, function (_a) {
    var name = _a.name, desc = _a.desc;
    docString += name + " | " + desc + "\n";
});
fs.writeFileSync('docs/EFFECTS.md', docString);
