"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fs = require("fs");
var Professions = require("../core/professions/_all");
var Spells = require("../plugins/combat/spells/_all");
var docString = "\n# IdleLands Class Spells\n\n## Table of Contents\n\n";
_.each(_.sortBy(_.keys(Professions)), function (profession, index) {
    docString += index + 1 + ". [" + profession + "](#" + profession.toLowerCase() + ")\n";
});
docString += '\n\n';
_.each(_.sortBy(_.keys(Professions)), function (profession) {
    docString += "## " + profession + "\n\n";
    docString += 'Name | Element | Level | Description | Required Collectibles\n';
    docString += '---- | ------- | ----- | ----------- | ---------------------\n';
    var professionSpellsSorted = _(Spells)
        .values()
        .tap(function (arr) {
        _.each(arr, function (spell) {
            _.each(spell.tiers, function (tier) {
                tier._description = spell.description || '';
                tier._spellName = spell.name;
                tier._element = spell.element;
            });
        });
    })
        .map(function (spell) { return spell.tiers; })
        .flattenDeep()
        .reject(function (tier) { return tier.profession !== profession; })
        .tap(function (arr) {
        var tiers = {};
        _.each(arr, function (tier) {
            if (!tiers[tier._spellName])
                tiers[tier._spellName] = 1;
            tier._level = tiers[tier._spellName];
            tiers[tier._spellName]++;
        });
    })
        .sortBy(['level', 'name'])
        .value();
    _.each(professionSpellsSorted, function (tier) {
        docString += tier.name + " ([" + tier._spellName + " " + tier._level + "](../src/plugins/combat/spells/" + tier._spellName + ".js)) | " + tier._element + " | " + tier.level + " | " + tier._description + " | " + (tier.collectibles ? tier.collectibles.join(', ') : '') + "\n";
    });
    docString += '\n\n';
});
fs.writeFileSync('docs/SPELLS.md', docString);
