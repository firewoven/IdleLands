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
var Ascended = (function (_super) {
    __extends(Ascended, _super);
    function Ascended() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ascended.achievementData = function (player) {
        var totalAscensions = player.$statistics.getStat('Character.Ascension.Times');
        if (totalAscensions < 1)
            return [];
        return [{
                tier: totalAscensions,
                name: 'Ascended',
                desc: "Gain bonuses for ascending " + totalAscensions + " times.",
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: [{
                        type: 'title',
                        title: 'Ascended',
                        deathMessage: '%player went to a higher plane of existence.'
                    }, {
                        type: 'petattr',
                        petattr: 'a golden and silver halo with an angel floating above it bathed in the light of Idliathlia'
                    }, {
                        type: 'stats',
                        itemFindRangeMultiplier: (totalAscensions * 0.1).toFixed(2),
                        itemValueMultiplier: (totalAscensions * 0.03).toFixed(2),
                        gold: function (player, baseValue) { return baseValue * 0.15 * totalAscensions; },
                        goldDisplay: "+" + totalAscensions * 15 + "%",
                        xp: function (player, baseValue) { return baseValue * 0.05 * totalAscensions; },
                        xpDisplay: "+" + totalAscensions * 5 + "%"
                    }]
            }];
    };
    return Ascended;
}(achievement_1.Achievement));
exports.Ascended = Ascended;
