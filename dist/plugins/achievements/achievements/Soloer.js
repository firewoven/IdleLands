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
var Soloer = (function (_super) {
    __extends(Soloer, _super);
    function Soloer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Soloer.achievementData = function (player) {
        var totalSoloCombats = player.$statistics.getStat('CombatSolo');
        if (totalSoloCombats < 5000)
            return [];
        return [{
                tier: 1,
                name: 'Soloer',
                desc: "Gain a special title (and +10% max item score) for " + (5000).toLocaleString() + " solo battles.",
                type: achievement_1.AchievementTypes.COMBAT,
                rewards: [{
                        type: 'title',
                        title: 'Soloer',
                        deathMessage: '%player didn\'t have anyone to watch %hisher back and got stabbed in the back by a backstabbing backstabber.'
                    }, {
                        type: 'petattr',
                        petattr: 'a shield that you probably need by now'
                    }, {
                        type: 'stats',
                        itemFindRangeMultiplier: 0.1
                    }]
            }];
    };
    return Soloer;
}(achievement_1.Achievement));
exports.Soloer = Soloer;
