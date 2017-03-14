"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var constitute_1 = require("constitute");
var _ = require("lodash");
var AllAchievements = require("./achievements/_all");
var logger_1 = require("../../shared/logger");
var settings_1 = require("../../static/settings");
var PREMIUM_TITLES = [
    'Donator',
    'Contributor'
];
var PREMIUM_TIERS = {
    Donator: 1,
    Contributor: 2
};
var Achievements = (function () {
    function Achievements(container) {
        var _this = this;
        var AchievementsDb = require('./achievements.db').AchievementsDb;
        try {
            container.schedulePostConstructor(function (achievementsDb) {
                _this.achievementsDb = achievementsDb;
            }, [AchievementsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Achievements', e);
        }
    }
    // clear current variables and set new
    Achievements.prototype.init = function (opts) {
        this._id = undefined;
        this.achievements = undefined;
        _.extend(this, opts);
        if (!this.achievements)
            this.achievements = {};
        if (!this.uniqueAchievements) {
            this.save();
        }
    };
    Achievements.prototype.premiumTier = function () {
        var tiers = _.intersection(PREMIUM_TITLES, this.titles());
        if (tiers.length === 0)
            return 0;
        return PREMIUM_TIERS[_.maxBy(tiers, function (tier) { return PREMIUM_TIERS[tier]; })];
    };
    Achievements.prototype.petAttributes = function () {
        return _(this.achievements)
            .values()
            .map(function (achi) { return achi.rewards; })
            .flattenDeep()
            .compact()
            .filter(function (reward) { return reward.type === 'petattr'; })
            .map(function (reward) { return reward.petattr; })
            .value().concat(settings_1.SETTINGS.validPetAttributes);
    };
    Achievements.prototype.petClasses = function () {
        return _(this.achievements)
            .values()
            .map(function (achi) { return achi.rewards; })
            .flattenDeep()
            .compact()
            .filter(function (reward) { return reward.type === 'petclass'; })
            .map(function (reward) { return reward.petclass; })
            .value().concat(['Monster']);
    };
    Achievements.prototype.titles = function () {
        return _(this.achievements)
            .values()
            .map(function (achi) { return achi.rewards; })
            .flattenDeep()
            .compact()
            .filter(function (reward) { return reward.type === 'title'; })
            .map(function (reward) { return reward.title; })
            .value();
    };
    Achievements.prototype.getDeathMessageForTitle = function (title) {
        var titleReward = _(this.achievements)
            .values()
            .map(function (achi) { return achi.rewards; })
            .flattenDeep()
            .compact()
            .filter(function (reward) { return reward.type === 'title'; })
            .filter(function (reward) { return reward.title === title; })
            .value()[0];
        if (titleReward)
            return titleReward.deathMessage;
        return '';
    };
    Achievements.prototype.tiers = function () {
        return _(this.achievements)
            .values()
            .flattenDeep()
            .map('tier')
            .sum();
    };
    Achievements.prototype._allAchievements = function (player) {
        return _(AllAchievements)
            .values()
            .map(function (ach) {
            logger_1.Logger.silly('ACHIEVEMENT', "checking " + ach.name);
            return ach.achievementData(player) || [];
        })
            .flattenDeep()
            .compact()
            .value();
    };
    Achievements.prototype.addAchievement = function (achievement) {
        this.achievements[achievement.name] = achievement;
    };
    Achievements.prototype.hasAchievement = function (achievement) {
        return this.achievements && this.achievements[achievement];
    };
    Achievements.prototype.hasAchievementAtTier = function (achievement, tier) {
        return this.hasAchievement(achievement) && this.achievements[achievement].tier >= tier;
    };
    Achievements.prototype.checkAchievements = function (player) {
        var _this = this;
        try {
            var earned = this._allAchievements(player);
            logger_1.Logger.silly('Achievement', "Earned " + earned);
            var mine_1 = this.achievements;
            logger_1.Logger.silly('Achievement', "Mine " + mine_1);
            var newAchievements_1 = [];
            _.each(earned, function (ach) {
                logger_1.Logger.silly('Achievement', "Checking " + player.name + "|" + ach);
                if (mine_1[ach.name] && mine_1[ach.name].tier >= ach.tier)
                    return;
                newAchievements_1.push(ach);
            });
            logger_1.Logger.silly('Achievement', "New " + newAchievements_1);
            // always update the achievement data just in case
            this.achievements = {};
            _.each(earned, function (ach) {
                logger_1.Logger.silly('Achievement', "Adding " + ach);
                _this.addAchievement(ach);
            });
            logger_1.Logger.silly('Achievement', 'Saving');
            this.save();
            if (newAchievements_1.length > 0) {
                logger_1.Logger.silly('Achievement', 'Recalculating');
                player.recalculateStats();
            }
            logger_1.Logger.silly('Achievement', 'Done');
            return newAchievements_1;
        }
        catch (e) {
            logger_1.Logger.error('wat', e);
        }
    };
    Achievements.prototype.uniqueAchievementCount = function () {
        return _.size(this.achievements);
    };
    Achievements.prototype.save = function () {
        this.uniqueAchievements = this.uniqueAchievementCount();
        this.totalAchievementTiers = this.tiers();
        this.totalTitles = this.titles().length;
        this.achievementsDb.saveAchievements(this);
    };
    return Achievements;
}());
Achievements = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Achievements);
exports.Achievements = Achievements;
