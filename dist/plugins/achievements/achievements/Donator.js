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
var Donator = (function (_super) {
    __extends(Donator, _super);
    function Donator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Donator.achievementData = function (player) {
        var isValid = _.get(player, "permanentAchievements." + this.permanentProp);
        if (!isValid)
            return [];
        var tier = 1;
        var rewards = [
            { type: 'title', title: 'Donator', deathMessage: '%player donated to the best cause of all: their inevitable demise.' },
            { type: 'petattr', petattr: 'a platinum bar that says thank you so much, literally' }
        ];
        return [{
                tier: tier,
                name: 'Donator',
                desc: 'You donated (via PayPal)! Yay! Thanks for being an early supporter!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: rewards
            }];
    };
    return Donator;
}(achievement_1.Achievement));
Donator.permanentProp = 'paypalDonator';
exports.Donator = Donator;
