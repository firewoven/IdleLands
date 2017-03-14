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
var Boxer = (function (_super) {
    __extends(Boxer, _super);
    function Boxer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boxer.achievementData = function (player) {
        var value = player.$statistics.countChild('Character.Treasure');
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
                dex: tier * 10,
                agi: tier * 10
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Boxer', deathMessage: '%player went home for boxing day.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a mini treasure chest containing an even smaller treasure chest' });
        }
        return [{
                tier: tier,
                name: 'Boxer',
                desc: "+" + (tier * 10).toLocaleString() + " DEX/AGI for opening " + baseValue * tier + " chests.",
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: rewards
            }];
    };
    return Boxer;
}(achievement_1.Achievement));
exports.Boxer = Boxer;
