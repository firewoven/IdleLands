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
var Enchanted = (function (_super) {
    __extends(Enchanted, _super);
    function Enchanted() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Enchanted.achievementData = function (player) {
        var isValid = _.get(player, "permanentAchievements." + this.permanentProp);
        if (!isValid) {
            var secondCheck = _.reduce(_.values(player.equipment), (function (prev, item) { return prev + (item.enchantLevel || 0); }), 0) >= 100;
            if (secondCheck) {
                _.set(player, "permanentAchievements." + this.permanentProp, true);
            }
            else {
                return [];
            }
        }
        return [{
                tier: 1,
                name: 'Enchanted',
                desc: 'Gain a special title (and +10% max item score) for having 100 concurrent enchantments.',
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{
                        type: 'title',
                        title: 'Enchanted',
                        deathMessage: '%player was so transfixed on the transmogrification of %himherself that %she died in the process.'
                    }, {
                        type: 'petattr',
                        petattr: 'a blob of arcane dust'
                    }, {
                        type: 'stats',
                        itemFindRangeMultiplier: 0.1
                    }]
            }];
    };
    return Enchanted;
}(achievement_1.Achievement));
Enchanted.permanentProp = 'enchanted';
exports.Enchanted = Enchanted;
