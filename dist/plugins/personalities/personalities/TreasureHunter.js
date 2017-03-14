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
var TreasureHunter = (function (_super) {
    __extends(TreasureHunter, _super);
    function TreasureHunter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreasureHunter.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
    };
    TreasureHunter.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
    };
    TreasureHunter.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Item.Sell') >= 100;
    };
    return TreasureHunter;
}(personality_1.Personality));
TreasureHunter.description = 'Find better items, but gain significantly less gold and xp.';
TreasureHunter.stats = {
    xp: function (player, baseValue) { return -baseValue * 0.84; },
    gold: function (player, baseValue) { return -baseValue * 0.84; },
    itemFindRangeMultiplier: function (player) { return player.level * 0.03; }
};
exports.TreasureHunter = TreasureHunter;
