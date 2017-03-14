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
var _ = require("lodash");
var achievement_1 = require("../achievement");
var Explorative = (function (_super) {
    __extends(Explorative, _super);
    function Explorative() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Explorative.achievementData = function (player) {
        var totalMaps = _.size(player.$statistics.getStat('Character.Maps'));
        var tier = 1;
        while (totalMaps >= tier * 5) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                int: function (player, baseValue) { return baseValue * 0.01 * tier; },
                intDisplay: "+" + tier + "%"
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Explorative', deathMessage: '%player wanted to explore the underworld.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a map that only works when held upside down' });
        }
        return [{
                tier: tier,
                name: 'Explorative',
                desc: "Gain +" + tier + "% INT for exploring " + (tier * 5).toLocaleString() + " unique maps.",
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: rewards
            }];
    };
    return Explorative;
}(achievement_1.Achievement));
exports.Explorative = Explorative;
