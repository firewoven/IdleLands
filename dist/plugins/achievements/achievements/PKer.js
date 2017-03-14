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
var PKer = (function (_super) {
    __extends(PKer, _super);
    function PKer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PKer.achievementData = function (player) {
        var value = player.$statistics.getStat('Combat.Kills.Player');
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
            rewards.push({ type: 'title', title: 'PKer', deathMessage: '%player killed too many friends that this was probably a long time coming.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a talking sword that only says mean things to you' });
        }
        return [{
                tier: tier,
                name: 'PKer',
                desc: "Gain +" + (tier * 5).toLocaleString() + " STR/CON/DEX/INT/AGI and +" + (tier * 10).toLocaleString() + "% better item find for killing " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " players.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return PKer;
}(achievement_1.Achievement));
exports.PKer = PKer;
