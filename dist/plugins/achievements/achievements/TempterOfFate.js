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
var TempterOfFate = (function (_super) {
    __extends(TempterOfFate, _super);
    function TempterOfFate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TempterOfFate.achievementData = function (player) {
        var totalFates = player.$statistics.getStat('Character.Event.Providence');
        if (totalFates < 100000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Tempter of Fate',
            desc: "Gain a special title for " + (100000).toLocaleString() + " fate pool uses (AKA: being literally insane).",
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Tempter of Fate',
                    deathMessage: '%player tipped the scales of fate too many times and finally succumbed to it.'
                }, {
                    type: 'petattr',
                    petattr: 'a crazy hat that instills craziness'
                }]
        };
        if (totalFates >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Fateful Wolf',
                deathMessage: '%player was raised by wolves and died like one.'
            });
        }
        return [baseReward];
    };
    return TempterOfFate;
}(achievement_1.Achievement));
exports.TempterOfFate = TempterOfFate;
