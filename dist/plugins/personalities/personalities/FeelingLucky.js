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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var personality_1 = require("../personality");
var FeelingLucky = (function (_super) {
    __extends(FeelingLucky, _super);
    function FeelingLucky() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FeelingLucky.disable = function (player) {
        _super.disable.call(this, player);
        this.flagDirty(player, ['GamblingChance', 'GoldBlessChance', 'GoldForsakeChance']);
    };
    FeelingLucky.enable = function (player) {
        _super.enable.call(this, player);
        this.flagDirty(player, ['GamblingChance', 'GoldBlessChance', 'GoldForsakeChance']);
    };
    FeelingLucky.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Event.Gambling') >= 100
            && player.$statistics.getStat('Character.Gamble.DoubleDown') >= player.$statistics.getStat('Character.Event.Gambling') / 4
            && player.$achievements.hasAchievement('Gambler');
    };
    return FeelingLucky;
}(personality_1.Personality));
FeelingLucky.description = 'Gambling is your only form of income.';
FeelingLucky.stats = {
    GamblingChance: function (player, baseValue) { return _this.hasEarned(player) ? baseValue * 2 : 0; },
    GoldForsakeChance: function (player, baseValue) { return _this.hasEarned(player) ? -baseValue * 10 : 0; },
    GoldBlessChance: function (player, baseValue) { return _this.hasEarned(player) ? -baseValue * 10 : 0; }
};
exports.FeelingLucky = FeelingLucky;
