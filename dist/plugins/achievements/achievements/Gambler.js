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
var achievement_1 = require("../achievement");
var Gambler = (function (_super) {
    __extends(Gambler, _super);
    function Gambler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gambler.achievementData = function (player) {
        var value = player.$statistics.getStat('Character.Gold.Gamble.Win') + player.$statistics.getStat('Character.Gold.Gamble.Lose');
        var baseValue = 100000;
        var wins = player.$statistics.getStat('Character.Gamble.WinTimes');
        var loses = player.$statistics.getStat('Character.Gamble.LoseTimes');
        var winsDD = player.$statistics.getStat('Character.Gamble.WinTimesDoubleDown');
        var losesDD = player.$statistics.getStat('Character.Gamble.LoseTimesDoubleDown');
        if (wins < 10 || loses < 30 || winsDD < 3 || losesDD < 10)
            return [];
        var tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                gold: function (player, baseValue) { return baseValue * 0.05 * tier; },
                goldDisplay: "+" + tier * 5 + "%"
            }];
        if (tier >= 3) {
            rewards.push({ type: 'title', title: 'Gambler', deathMessage: '%player gambled away %hisher life.' });
        }
        if (tier >= 4) {
            rewards.push({ type: 'petattr', petattr: 'a double-headed coin' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Irresponsible' });
        }
        return [{
                tier: tier,
                name: 'Gambler',
                desc: "Gain " + (tier * 5).toLocaleString() + "% more gold for gambling at least " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " gold.",
                type: achievement_1.AchievementTypes.EVENT,
                rewards: rewards
            }];
    };
    return Gambler;
}(achievement_1.Achievement));
exports.Gambler = Gambler;
