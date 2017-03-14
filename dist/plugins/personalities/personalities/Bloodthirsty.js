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
var Bloodthirsty = (function (_super) {
    __extends(Bloodthirsty, _super);
    function Bloodthirsty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bloodthirsty.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
    };
    Bloodthirsty.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
    };
    Bloodthirsty.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Event.Battle') >= 500
            && player.$statistics.getStat('Character.Event.BattlePvP') >= 50
            && player.$statistics.getStat('Combat.Win') >= 50;
    };
    return Bloodthirsty;
}(personality_1.Personality));
Bloodthirsty.disableOnActivate = ['Coward'];
Bloodthirsty.description = 'Be more likely to go into combat, but be more reckless.';
Bloodthirsty.stats = {
    BattleChance: function (player, baseValue) { return baseValue * 2; },
    BattlePvPChance: function (player, baseValue) { return baseValue * 2; },
    GoldForsakeChance: function (player, baseValue) { return baseValue; },
    XPForsakeChance: function (player, baseValue) { return baseValue; },
    ItemForsakeChance: function (player, baseValue) { return baseValue; }
};
exports.Bloodthirsty = Bloodthirsty;
