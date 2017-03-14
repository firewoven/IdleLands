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
var Collector = (function (_super) {
    __extends(Collector, _super);
    function Collector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collector.achievementData = function (player) {
        var totalCollectibles = player.$collectibles.totalCollectibles();
        var tier = 1;
        while (totalCollectibles >= tier * 25) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                agi: function (player, baseValue) { return baseValue * 0.01 * tier; },
                agiDisplay: "+" + tier + "%",
                str: function (player, baseValue) { return baseValue * 0.01 * tier; },
                strDisplay: "+" + tier + "%",
                dex: function (player, baseValue) { return baseValue * 0.01 * tier; },
                dexDisplay: "+" + tier + "%",
                con: function (player, baseValue) { return baseValue * 0.01 * tier; },
                conDisplay: "+" + tier + "%",
                int: function (player, baseValue) { return baseValue * 0.01 * tier; },
                intDisplay: "+" + tier + "%",
                itemFindRange: tier * 50
            }];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Collector', deathMessage: '%player tried collecting all the dragon balls but ran out of breath near the 7th one.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a bauble' });
        }
        return [{
                tier: tier,
                name: 'Collector',
                desc: "Gain +" + tier + "% AGI/CON/DEX/INT/STR and +" + tier * 50 + " max item score for having " + tier * 25 + " collectibles.",
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: rewards
            }];
    };
    return Collector;
}(achievement_1.Achievement));
exports.Collector = Collector;
