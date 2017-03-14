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
var Classfizzy = (function (_super) {
    __extends(Classfizzy, _super);
    function Classfizzy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Classfizzy.achievementData = function (player) {
        var allProfessionsBeen = player.$statistics.getStat('Character.Professions');
        var allProfessions = [
            'Beatomancer', 'Clockborg', 'Druid', 'Fencer', 'Lich', 'Trickster'
        ];
        var tier = 0;
        while (++tier) {
            if (!_.every(allProfessions, function (prof) { return allProfessionsBeen[prof] >= tier; }))
                break;
        }
        tier--;
        if (tier === 0)
            return [];
        return [{
                tier: tier,
                name: 'Classfizzy',
                desc: "+" + 2 * tier + "% STR/CON/DEX/INT/AGI/LUK and +" + tier * 50 + " max item score for being each advanced profession " + tier + " times.",
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{
                        type: 'title',
                        title: 'Fizzy',
                        deathMessage: '%player was so fizzy that they solidified.'
                    }, {
                        type: 'petattr',
                        petattr: 'a ball of gas'
                    }, {
                        type: 'stats',
                        agi: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        agiDisplay: "+" + tier * 2 + "%",
                        str: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        strDisplay: "+" + tier * 2 + "%",
                        dex: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        dexDisplay: "+" + tier * 2 + "%",
                        con: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        conDisplay: "+" + tier * 2 + "%",
                        int: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        intDisplay: "+" + tier * 2 + "%",
                        luk: function (player, baseValue) { return baseValue * 0.02 * tier; },
                        lukDisplay: "+" + tier * 2 + "%",
                        itemFindRange: tier * 50
                    }]
            }];
    };
    return Classfizzy;
}(achievement_1.Achievement));
exports.Classfizzy = Classfizzy;
