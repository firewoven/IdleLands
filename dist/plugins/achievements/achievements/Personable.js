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
var Personable = (function (_super) {
    __extends(Personable, _super);
    function Personable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Personable.achievementData = function (player) {
        var allPersonalities = player.$personalities._allPersonalities(player);
        return _.map(allPersonalities, function (pers) {
            return {
                tier: 1,
                name: "Personable: " + pers.name,
                desc: "Can now use personality " + pers.name + ".",
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{ type: 'personality', personality: pers.name }]
            };
        });
    };
    return Personable;
}(achievement_1.Achievement));
exports.Personable = Personable;
