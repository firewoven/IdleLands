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
var Critical = (function (_super) {
    __extends(Critical, _super);
    function Critical() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Critical.achievementData = function (player) {
        var totalCrits = player.$statistics.getStat('Combat.Give.CriticalHit');
        var tier = 1;
        var baseValue = 25;
        while (totalCrits >= baseValue * Math.pow(2, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                dex: function (player, baseValue) { return baseValue * 0.01 * tier; },
                dexDisplay: "+" + tier + "%"
            }];
        if (tier >= 6) {
            rewards.push({ type: 'title', title: 'Critical', deathMessage: '%player rolled a critical failure on their life-saving roll.' });
            rewards.push({ type: 'stats', crit: 1 });
        }
        if (tier >= 7) {
            rewards.push({ type: 'petattr', petattr: 'a giant bullseye with a few arrows in it' });
        }
        return [{
                tier: tier,
                name: 'Critical',
                desc: "Gain " + tier + "% DEX for having " + (baseValue * Math.pow(2, tier - 1)).toLocaleString() + " critical hits.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return Critical;
}(achievement_1.Achievement));
exports.Critical = Critical;
