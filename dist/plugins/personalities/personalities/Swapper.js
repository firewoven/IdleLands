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
var Swapper = (function (_super) {
    __extends(Swapper, _super);
    function Swapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Swapper.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['EnchantChance', 'ItemBlessChance', 'FindItemChance', 'SwitcherooChance']);
    };
    Swapper.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['EnchantChance', 'ItemBlessChance', 'FindItemChance', 'SwitcherooChance']);
    };
    Swapper.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Event.Switcheroo') >= 5
            && player.$statistics.getStat('Character.Event.ItemBless') >= 100
            && player.$statistics.getStat('Character.Event.FindItem') >= 1000
            && player.$achievements.hasAchievement('Enchanted');
    };
    return Swapper;
}(personality_1.Personality));
Swapper.description = 'More positive item effects, but more switcheroos.';
Swapper.stats = {
    EnchantChance: function (player, baseValue) { return baseValue; },
    ItemBlessChance: function (player, baseValue) { return baseValue; },
    FindItemChance: function (player, baseValue) { return baseValue; },
    SwitcherooChance: function (player, baseValue) { return baseValue * 6; }
};
exports.Swapper = Swapper;
