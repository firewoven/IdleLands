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
var Classfluid = (function (_super) {
    __extends(Classfluid, _super);
    function Classfluid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Classfluid.achievementData = function (player) {
        var allProfessionsBeen = player.$statistics.getStat('Character.Professions');
        var allProfessions = [
            'Archer', 'Barbarian', 'Bard', 'Bitomancer', 'Cleric', 'Fighter', 'Generalist', 'Jester',
            'Mage', 'MagicalMonster', 'Monster', 'Necromancer', 'Pirate', 'Rogue', 'SandwichArtist'
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
                name: 'Classfluid',
                desc: "+" + 3 * tier + "% STR/CON/DEX/INT/AGI/LUK and +" + tier * 100 + " max item score for being each basic profession " + tier + " times.",
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{
                        type: 'title',
                        title: 'Fluidic',
                        deathMessage: '%player was so fluid that they evaporated.'
                    }, {
                        type: 'petattr',
                        petattr: 'a drop of water'
                    }, {
                        type: 'stats',
                        agi: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        agiDisplay: "+" + tier * 3 + "%",
                        str: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        strDisplay: "+" + tier * 3 + "%",
                        dex: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        dexDisplay: "+" + tier * 3 + "%",
                        con: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        conDisplay: "+" + tier * 3 + "%",
                        int: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        intDisplay: "+" + tier * 3 + "%",
                        luk: function (player, baseValue) { return baseValue * 0.03 * tier; },
                        lukDisplay: "+" + tier * 3 + "%",
                        itemFindRange: tier * 100
                    }]
            }];
    };
    return Classfluid;
}(achievement_1.Achievement));
exports.Classfluid = Classfluid;
