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
var Walker = (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.achievementData = function (player) {
        var playerSteps = player.$statistics.getStat('Character.Steps');
        var tier = 1;
        while (playerSteps >= Math.pow(10, tier)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                xp: tier
            }];
        if (tier >= 6) {
            rewards.push({ type: 'title', title: 'Tired Foot', deathMessage: '%player got sick of walking and gave up.' });
        }
        if (tier >= 7) {
            rewards.push({ type: 'petattr', petattr: 'a pair of sneakers that are a size too small' });
        }
        return [{
                tier: tier,
                name: 'Walker',
                desc: "Gain +" + tier + " Bonus XP (added every time XP is gained) for taking " + (Math.pow(10, tier)).toLocaleString() + " steps.",
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: rewards
            }];
    };
    return Walker;
}(achievement_1.Achievement));
exports.Walker = Walker;
