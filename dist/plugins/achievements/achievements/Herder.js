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
var Herder = (function (_super) {
    __extends(Herder, _super);
    function Herder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Herder.achievementData = function (player) {
        var allPets = player.$pets.earnedPets;
        return _.map(allPets, function (_a) {
            var name = _a.name;
            return {
                tier: 1,
                name: "Herder: " + name,
                desc: "Can now buy pet " + name + ".",
                type: achievement_1.AchievementTypes.PET,
                rewards: [{ type: 'pet', pet: name }]
            };
        });
    };
    return Herder;
}(achievement_1.Achievement));
exports.Herder = Herder;
