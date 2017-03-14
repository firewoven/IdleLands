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
var Bossy = (function (_super) {
    __extends(Bossy, _super);
    function Bossy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bossy.achievementData = function (player) {
        var value = player.$statistics.countChild('Character.BossKills');
        var baseValue = 15;
        var tier = 1;
        while (value >= baseValue * tier) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                str: tier * 10,
                con: tier * 10
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Bossy', deathMessage: '%player ordered around the wrong person and the mutiny resulted in %hisher death!' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a goblin head on a spear' });
        }
        return [{
                tier: tier,
                name: 'Bossy',
                desc: "Gain +" + (tier * 10).toLocaleString() + " STR/CON for killing " + baseValue * tier + " bosses.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return Bossy;
}(achievement_1.Achievement));
exports.Bossy = Bossy;
