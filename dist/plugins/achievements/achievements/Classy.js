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
var Professions = require("../../../core/professions/_all");
var allStats = ['Con', 'Dex', 'Agi', 'Str', 'Int', 'Luk'];
var Classy = (function (_super) {
    __extends(Classy, _super);
    function Classy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Classy.achievementData = function (player) {
        var allProfessionsBeen = player.$statistics.getStat('Character.Professions');
        return _.flatten(_.map(allProfessionsBeen, function (times, prof) {
            var statReward = {
                type: 'stats'
            };
            _.each(allStats, function (stat) {
                var profStat = Professions[prof]["base" + stat + "PerLevel"];
                if (!profStat)
                    return;
                statReward[stat] = profStat;
            });
            var baseAchievements = [{
                    tier: 1,
                    name: "Classy: " + prof,
                    desc: "You've been a " + prof + ". Gain their base stats as a bonus!",
                    type: achievement_1.AchievementTypes.PROGRESS,
                    rewards: [statReward]
                }];
            var tiers = [
                { required: 5, tier: 1, title: 'Trainee', bonusRewards: { type: 'petclass', petclass: prof } },
                { required: 15, tier: 2, title: 'Student' },
                { required: 25, tier: 3, title: 'Skilled' },
                { required: 50, tier: 4, title: 'Master' },
                { required: 100, tier: 5, title: 'Grandmaster' }
            ];
            var professionalAchievement = {
                name: "Professional: " + prof,
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: []
            };
            var topMax = 0;
            _.each(tiers, function (_a) {
                var required = _a.required, tier = _a.tier, title = _a.title, bonusRewards = _a.bonusRewards;
                if (times < required)
                    return;
                var statReward = {
                    type: 'stats'
                };
                _.each(allStats, function (stat) {
                    var profStat = Professions[prof]["base" + stat + "PerLevel"] * required;
                    if (!profStat)
                        return;
                    statReward[stat] = profStat;
                });
                professionalAchievement.rewards.push(statReward);
                professionalAchievement.rewards.push({ type: 'title', title: title + " " + prof });
                if (bonusRewards) {
                    professionalAchievement.rewards.push(bonusRewards);
                }
                topMax = required;
                professionalAchievement.tier = tier;
            });
            if (professionalAchievement.rewards.length > 0) {
                professionalAchievement.desc = "You've been a " + prof + " " + topMax + " times. Get title(s) and stats for it!";
                baseAchievements.push(professionalAchievement);
            }
            return baseAchievements;
        }));
    };
    return Classy;
}(achievement_1.Achievement));
exports.Classy = Classy;
