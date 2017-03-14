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
var Achiever = (function (_super) {
    __extends(Achiever, _super);
    function Achiever() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Achiever.achievementData = function (player) {
        var value = player.$achievements.tiers();
        var baseValue = 30;
        var tier = 1;
        while (value >= baseValue * tier) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Achiever', deathMessage: '%player finally achieved something worthwhile: dying.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a golden plaque' });
        }
        return [{
                tier: tier,
                name: 'Achiever',
                desc: "Gain +" + tier + " achievement" + (tier > 1 ? 's' : '') + ".",
                type: achievement_1.AchievementTypes.EVENT,
                rewards: rewards
            }];
    };
    return Achiever;
}(achievement_1.Achievement));
exports.Achiever = Achiever;
