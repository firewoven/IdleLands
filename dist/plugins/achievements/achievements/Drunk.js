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
var Drunk = (function (_super) {
    __extends(Drunk, _super);
    function Drunk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drunk.achievementData = function (player) {
        var totalSteps = player.$statistics.getStat('Character.Movement.Drunk');
        if (totalSteps < 100000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Drunk',
            desc: "Gain a special title (and +5% max item score) for " + (100000).toLocaleString() + " drunken steps.",
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Drunk',
                    deathMessage: '%player drank too much and fell into a river.'
                }, {
                    type: 'petattr',
                    petattr: 'a bottle of booze'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (totalSteps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Lush Wolf',
                deathMessage: '%player drank too much and dozed off in the town square.'
            });
        }
        return [baseReward];
    };
    return Drunk;
}(achievement_1.Achievement));
exports.Drunk = Drunk;
