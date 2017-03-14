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
var Ancient = (function (_super) {
    __extends(Ancient, _super);
    function Ancient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ancient.achievementData = function (player) {
        var isValid = _.get(player, "permanentAchievements." + this.permanentProp);
        if (!isValid)
            return [];
        var tier = 1;
        var rewards = [{
                type: 'stats',
                str: function (player, baseValue) { return baseValue * 0.01 * tier; },
                con: function (player, baseValue) { return baseValue * 0.01 * tier; },
                dex: function (player, baseValue) { return baseValue * 0.01 * tier; },
                luk: function (player, baseValue) { return baseValue * 0.01 * tier; },
                int: function (player, baseValue) { return baseValue * 0.01 * tier; },
                agi: function (player, baseValue) { return baseValue * 0.01 * tier; },
                strDisplay: "+" + tier + "%",
                conDisplay: "+" + tier + "%",
                dexDisplay: "+" + tier + "%",
                lukDisplay: "+" + tier + "%",
                intDisplay: "+" + tier + "%",
                agiDisplay: "+" + tier + "%"
            }];
        rewards.push({ type: 'title', title: 'Ancient', deathMessage: '%player withered away and crumbled to dust.' });
        rewards.push({ type: 'petattr', petattr: 'an old rock' });
        return [{
                tier: tier,
                name: 'Ancient',
                desc: 'Gain +1% STR/CON/DEX/AGI/INT/LUK for playing the original IdleLands.',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: rewards
            }];
    };
    return Ancient;
}(achievement_1.Achievement));
Ancient.permanentProp = 'ancient';
exports.Ancient = Ancient;
