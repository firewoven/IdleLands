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
var Affirmer = (function (_super) {
    __extends(Affirmer, _super);
    function Affirmer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Affirmer.achievementData = function (player) {
        var totalAffirms = player.$statistics.getStat('Character.Choice.Affirm');
        if (totalAffirms < 5000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Affirmer',
            desc: "Gain a special title (and +5% max item score) for auto-accepting " + (5000).toLocaleString() + " choices.",
            type: achievement_1.AchievementTypes.EVENT,
            rewards: [{
                    type: 'title',
                    title: 'Affirmer',
                    deathMessage: '%player said yes to death.'
                }, {
                    type: 'petattr',
                    petattr: 'a personal yes-man'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        return [baseReward];
    };
    return Affirmer;
}(achievement_1.Achievement));
exports.Affirmer = Affirmer;
