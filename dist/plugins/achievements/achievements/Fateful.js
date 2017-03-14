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
var Fateful = (function (_super) {
    __extends(Fateful, _super);
    function Fateful() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fateful.achievementData = function (player) {
        var totalFates = player.$statistics.getStat('Character.Event.Providence');
        if (totalFates < 500)
            return [];
        return [{
                tier: 1,
                name: 'Fateful',
                desc: 'Gain a special title (and +5% max item score) for 500 fate pool uses.',
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: [{
                        type: 'title',
                        title: 'Fateful',
                        deathMessage: '%player tempted the scales of fate and was nerfed.'
                    }, {
                        type: 'petattr',
                        petattr: 'a miniature pool with a question mark in it'
                    }, {
                        type: 'stats',
                        itemFindRangeMultiplier: 0.05
                    }]
            }];
    };
    return Fateful;
}(achievement_1.Achievement));
exports.Fateful = Fateful;
