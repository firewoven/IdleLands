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
var Territorial = (function (_super) {
    __extends(Territorial, _super);
    function Territorial() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Territorial.achievementData = function (player) {
        var totalRegions = _.size(player.$statistics.getStat('Character.Regions'));
        var tier = 1;
        while (totalRegions >= tier * 10) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                str: function (player, baseValue) { return baseValue * 0.01 * tier; },
                strDisplay: "+" + tier + "%"
            }];
        if (tier >= 10) {
            rewards.push({ type: 'title', title: 'Territorial', deathMessage: '%player tried guarding %hisher territory but got served by a rival gang.' });
        }
        if (tier >= 11) {
            rewards.push({ type: 'petattr', petattr: 'a dog to help guard your territory' });
        }
        return [{
                tier: tier,
                name: 'Territorial',
                desc: "Gain +" + tier + "% STR for every " + (tier * 10).toLocaleString() + " unique regions explored.",
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: rewards
            }];
    };
    return Territorial;
}(achievement_1.Achievement));
exports.Territorial = Territorial;
