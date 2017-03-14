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
var Indecisive = (function (_super) {
    __extends(Indecisive, _super);
    function Indecisive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Indecisive.achievementData = function (player) {
        var totalDenies = player.$statistics.getStat('Character.Choice.Indecisive');
        if (totalDenies < 5000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Indecisive',
            desc: "Gain a special title (and +5% max item score) for being indecisive about " + (5000).toLocaleString() + " choices.",
            type: achievement_1.AchievementTypes.EVENT,
            rewards: [{
                    type: 'title',
                    title: 'Indecisive',
                    deathMessage: '%player wasn\'t sure about death. Turns out death doesn\'t care.'
                }, {
                    type: 'petattr',
                    petattr: 'an entropy machine'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        return [baseReward];
    };
    return Indecisive;
}(achievement_1.Achievement));
exports.Indecisive = Indecisive;
