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
var Contributor = (function (_super) {
    __extends(Contributor, _super);
    function Contributor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Contributor.achievementData = function (player) {
        var isValid = _.get(player, "permanentAchievements." + this.permanentProp);
        if (!isValid)
            return [];
        var tier = 1;
        var rewards = [
            { type: 'title', title: 'Contributor', deathMessage: '%player found out that contributing to their death IRA was not such a good idea after all.' },
            { type: 'petattr', petattr: 'a gold coin that says thank you' }
        ];
        return [{
                tier: tier,
                name: 'Contributor',
                desc: 'You contributed! Yay! Thanks!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: rewards
            }];
    };
    return Contributor;
}(achievement_1.Achievement));
Contributor.permanentProp = 'contributor';
exports.Contributor = Contributor;
