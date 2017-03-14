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
var Golden = (function (_super) {
    __extends(Golden, _super);
    function Golden() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Golden.achievementData = function (player) {
        var value = player.$statistics.getStat('Character.Gold.Gain') + player.$statistics.getStat('Character.Gold.Lose');
        var baseValue = 20000;
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
                agi: function (player, baseValue) { return baseValue * 0.01 * tier; },
                agiDisplay: "+" + tier + "%"
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Golden Child', deathMessage: '%player was transmuted into a literal brick of gold and sold on the gold market. Talk about going gold.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a chunk of metal that is painted gold' });
        }
        return [{
                tier: tier,
                name: 'Golden',
                desc: "Sell items for " + (tier * 5).toLocaleString() + "% more for gaining and losing at least " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " gold, and +" + tier + "% AGI.",
                type: achievement_1.AchievementTypes.EVENT,
                rewards: rewards
            }];
    };
    return Golden;
}(achievement_1.Achievement));
exports.Golden = Golden;
