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
var DigitalMagician = (function (_super) {
    __extends(DigitalMagician, _super);
    function DigitalMagician() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DigitalMagician.achievementData = function (player) {
        var totalDigitals = player.$statistics.getStat('Combat.Utilize.Digital');
        if (totalDigitals < 30000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Digital Magician',
            desc: "Gain a special title (and +5% max item score) for " + (30000).toLocaleString() + " Digital skill uses.",
            type: achievement_1.AchievementTypes.COMBAT,
            rewards: [{
                    type: 'title',
                    title: 'Digital Magician',
                    deathMessage: '%player became nothing more than bits and pieces.'
                }, {
                    type: 'petattr',
                    petattr: 'a digitally signed certificate'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (totalDigitals >= 100000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Digital Wizard',
                deathMessage: '%player became nothing more than bytes and pieces.'
            });
        }
        if (totalDigitals >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Digital Wolf',
                deathMessage: '%player\'s endian ordering changed from big to little.'
            });
        }
        return [baseReward];
    };
    return DigitalMagician;
}(achievement_1.Achievement));
exports.DigitalMagician = DigitalMagician;
