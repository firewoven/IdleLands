"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var personality_1 = require("../personality");
var Explorer = (function (_super) {
    __extends(Explorer, _super);
    function Explorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Explorer.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
    };
    Explorer.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
    };
    Explorer.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Steps') >= 100000;
    };
    return Explorer;
}(personality_1.Personality));
Explorer.description = 'You gain 50% more xp, but your stats are lowered by 25%.';
Explorer.stats = {
    xp: function (player, baseValue) { return baseValue * 0.5; },
    str: function (player, baseValue) { return -baseValue * 0.25; },
    con: function (player, baseValue) { return -baseValue * 0.25; },
    dex: function (player, baseValue) { return -baseValue * 0.25; },
    agi: function (player, baseValue) { return -baseValue * 0.25; },
    int: function (player, baseValue) { return -baseValue * 0.25; }
};
exports.Explorer = Explorer;
