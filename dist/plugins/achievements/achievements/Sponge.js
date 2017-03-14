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
var Sponge = (function (_super) {
    __extends(Sponge, _super);
    function Sponge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sponge.achievementData = function (player) {
        var value = player.$statistics.getStat('Combat.Receive.Damage');
        var baseValue = 1000;
        var tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                hp: function (player, baseValue) { return baseValue * 0.01 * tier; },
                hpDisplay: "+" + tier + "%",
                con: 20 * tier
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Sponge', deathMessage: '%player could only absorb so much.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a sponge' });
        }
        return [{
                tier: tier,
                name: 'Sponge',
                desc: "Gain +" + tier + "% HP and +" + (tier * 20).toLocaleString() + " CON for taking " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " damage.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: rewards
            }];
    };
    return Sponge;
}(achievement_1.Achievement));
exports.Sponge = Sponge;
