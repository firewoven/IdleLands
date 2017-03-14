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
var Effective = (function (_super) {
    __extends(Effective, _super);
    function Effective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Effective.achievementData = function (player) {
        var value = player.$statistics.countChild('Combat.Give.Effect');
        var baseValue = 200;
        var tier = 1;
        while (value >= baseValue * Math.pow(2, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                mp: function (player, baseValue) { return baseValue * 0.01 * tier; },
                mpDisplay: "+" + tier + "%"
            }];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Effective', deathMessage: '%player effectively got written out of a will by dying.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a warped painting of the Mona Liza' });
        }
        return [{
                tier: tier,
                name: 'Effective',
                desc: "Gain +" + tier + "% MP for " + (baseValue * Math.pow(2, tier - 1)).toLocaleString() + " combat effect usages.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return Effective;
}(achievement_1.Achievement));
exports.Effective = Effective;
