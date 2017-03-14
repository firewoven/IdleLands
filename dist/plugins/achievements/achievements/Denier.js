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
var Denier = (function (_super) {
    __extends(Denier, _super);
    function Denier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Denier.achievementData = function (player) {
        var totalDenies = player.$statistics.getStat('Character.Choice.Deny');
        if (totalDenies < 5000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Denier',
            desc: "Gain a special title (and +5% max item score) for auto-denying " + (5000).toLocaleString() + " choices.",
            type: achievement_1.AchievementTypes.EVENT,
            rewards: [{
                    type: 'title',
                    title: 'Denier',
                    deathMessage: '%player said no to death, but died anyway.'
                }, {
                    type: 'petattr',
                    petattr: 'a personal no-sir'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        return [baseReward];
    };
    return Denier;
}(achievement_1.Achievement));
exports.Denier = Denier;
