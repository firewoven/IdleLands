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
var Eventful = (function (_super) {
    __extends(Eventful, _super);
    function Eventful() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Eventful.achievementData = function (player) {
        var totalEvents = player.$statistics.getStat('Character.Events');
        var baseValue = 100;
        var tier = 1;
        while (totalEvents >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                itemFindRangeMultiplier: (tier * 0.1).toFixed(1)
            }];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Center of Attention', deathMessage: '%player exploded into a fantastic display of lights, disco, and confetti.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a megaphone' });
        }
        return [{
                tier: tier,
                name: 'Eventful',
                desc: "Equip items that are " + (10 * tier).toLocaleString() + "% better for experiencing " + (baseValue * Math.pow(10, tier - 1)).toLocaleString() + " events.",
                type: achievement_1.AchievementTypes.EVENT,
                rewards: rewards
            }];
    };
    return Eventful;
}(achievement_1.Achievement));
exports.Eventful = Eventful;
