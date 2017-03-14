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
var Entitled = (function (_super) {
    __extends(Entitled, _super);
    function Entitled() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Entitled.achievementData = function (player) {
        var value = player.$achievements.titles().length;
        var baseValue = 15;
        if (value < baseValue)
            return [];
        return [{
                tier: 1,
                name: 'Entitled',
                desc: 'Gain a title for getting 15 titles.',
                type: achievement_1.AchievementTypes.EVENT,
                rewards: [{
                        type: 'title',
                        title: 'Entitled',
                        deathMessage: '%player didn\'t want to live anyway, b-b-baka!'
                    }, {
                        type: 'petattr',
                        petattr: 'a small child who wants a lot of things'
                    }]
            }];
    };
    return Entitled;
}(achievement_1.Achievement));
exports.Entitled = Entitled;
