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
var Consumerist = (function (_super) {
    __extends(Consumerist, _super);
    function Consumerist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Consumerist.achievementData = function (player) {
        var value = player.$statistics.getStat('Character.Gold.Spent');
        var baseValue = 1000;
        var tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                itemValueMultiplier: (tier * 0.05).toFixed(2),
                dex: function (player, baseValue) { return baseValue * 0.01 * tier; },
                dexDisplay: "+" + tier + "%"
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Consumerist', deathMessage: '%player consumed too much and died of an implosive explosion.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a bronze coin that looks like it got chewed on' });
        }
        return [{
                tier: tier,
                name: 'Consumerist',
                desc: "Sell items for " + (tier * 5).toLocaleString() + "% more for spending " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " gold, and gain +" + tier + "% DEX.",
                type: achievement_1.AchievementTypes.EVENT,
                rewards: rewards
            }];
    };
    return Consumerist;
}(achievement_1.Achievement));
exports.Consumerist = Consumerist;
