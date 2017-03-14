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
var SoleFoot = (function (_super) {
    __extends(SoleFoot, _super);
    function SoleFoot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoleFoot.achievementData = function (player) {
        var soloSteps = player.$statistics.getStat('Character.Movement.Solo');
        if (soloSteps < 100000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Sole Foot',
            desc: "Gain a special title (and +5% max item score) for taking " + (100000).toLocaleString() + " solo steps.",
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Sole Foot',
                    deathMessage: '%player was walking on one foot for too long that %she fell over and died.'
                }, {
                    type: 'petattr',
                    petattr: 'a literal rabbit foot'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (soloSteps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Lone Wolf',
                deathMessage: '%player was alone for too long in the prairie and got eaten by a wolf.'
            });
        }
        return [baseReward];
    };
    return SoleFoot;
}(achievement_1.Achievement));
exports.SoleFoot = SoleFoot;
