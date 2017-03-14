"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Personality = (function () {
    function Personality() {
    }
    Personality.hasEarned = function () { };
    Personality.enable = function (player) {
        _.each(this.disableOnActivate, function (personality) {
            if (!player.$personalities.activePersonalities[personality])
                return;
            player.$personalities.activePersonalities[personality] = false;
        });
        if (_.size(this.stats) > 0) {
            player.recalculateStats();
            player._updatePlayer();
        }
    };
    Personality.disable = function (player) {
        if (_.size(this.stats) > 0) {
            player.recalculateStats();
            player._updatePlayer();
        }
    };
    Personality.flagDirty = function (player, stats) {
        _.each(stats, function (stat) {
            player.$dirty.flags[stat] = true;
        });
        player.recalculateStats(stats);
    };
    return Personality;
}());
Personality.disableOnActivate = [];
Personality.description = 'This personality has no description';
Personality.stats = {};
exports.Personality = Personality;
