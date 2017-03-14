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
var Slayer = (function (_super) {
    __extends(Slayer, _super);
    function Slayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slayer.achievementData = function (player) {
        var value = player.$statistics.getStat('Combat.Kills.Monster');
        var baseValue = 10;
        var tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                str: 5 * tier,
                con: 5 * tier,
                dex: 5 * tier,
                int: 5 * tier,
                agi: 5 * tier,
                itemFindRangeMultiplier: (tier * 0.1).toFixed(1)
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Slayer', deathMessage: '%player died an ironic death of getting impaled by the spear of the child\'s child\'s child of the first goblin %she killed.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a talking hammer that talks about nailing monsters' });
        }
        return [{
                tier: tier,
                name: 'Slayer',
                desc: "Gain +" + (tier * 5).toLocaleString() + " STR/CON/DEX/INT/AGI and +" + (tier * 10).toLocaleString() + "% better item find for killing " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " monsters.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return Slayer;
}(achievement_1.Achievement));
exports.Slayer = Slayer;
