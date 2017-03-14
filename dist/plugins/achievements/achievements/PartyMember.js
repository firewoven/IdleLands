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
var PartyMember = (function (_super) {
    __extends(PartyMember, _super);
    function PartyMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PartyMember.achievementData = function (player) {
        var totalPartySteps = player.$statistics.getStat('Character.Movement.Party');
        if (totalPartySteps < 100000)
            return [];
        var baseReward = {
            tier: 1,
            name: 'Party Member',
            desc: "Gain a special title (and +5% max item score) for being in a party for " + (100000).toLocaleString() + " steps.",
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Party Member',
                    deathMessage: '%player died through the power of TEAM SYNERGY!'
                }, {
                    type: 'petattr',
                    petattr: 'a paper people chain'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (totalPartySteps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Pack Wolf',
                deathMessage: '%player got eaten by a pack of wolves.'
            });
        }
        return [baseReward];
    };
    return PartyMember;
}(achievement_1.Achievement));
exports.PartyMember = PartyMember;
