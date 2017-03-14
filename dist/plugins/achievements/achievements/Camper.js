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
var Camper = (function (_super) {
    __extends(Camper, _super);
    function Camper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camper.achievementData = function (player) {
        var totalCamps = player.$statistics.getStat('Character.Movement.Camping');
        if (totalCamps < 100000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Camper',
            desc: "Gain a special title (and +5% max item score) for camping for " + (100000).toLocaleString() + " steps.",
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Camper',
                    deathMessage: '%player found out the hard way that campfires are hot.'
                }, {
                    type: 'petattr',
                    petattr: 'a flaming log'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (totalCamps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Camping Wolf',
                deathMessage: '%player burned down the nearby forest after leaving a campfire running all night.'
            });
        }
        return [baseReward];
    };
    return Camper;
}(achievement_1.Achievement));
exports.Camper = Camper;
