"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Spells = require("./spells/_all");
var SpellManager = (function () {
    function SpellManager() {
    }
    SpellManager.validSpells = function (player) {
        return _(Spells)
            .values()
            .filter(function (spellData) {
            return _.filter(spellData.tiers, function (tier) {
                return (tier.profession === player.professionName
                    || (player.$secondaryProfessions && _.includes(player.$secondaryProfessions, tier.profession)))
                    && tier.level <= player.level;
            }).length > 0;
        })
            .value();
    };
    return SpellManager;
}());
exports.SpellManager = SpellManager;
