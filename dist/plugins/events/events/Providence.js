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
var event_1 = require("../event");
var equipment_1 = require("../../../core/base/equipment");
var adventure_log_1 = require("../../../shared/adventure-log");
var string_generator_1 = require("../../../shared/string-generator");
var settings_1 = require("../../../static/settings");
exports.WEIGHT = -1;
// Get the gift of the divine
var Providence = (function (_super) {
    __extends(Providence, _super);
    function Providence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Providence.generateProvidenceItem = function (multiplier, t0shift, t1shift, t2shift) {
        if (multiplier === void 0) { multiplier = 1; }
        if (t0shift === void 0) { t0shift = 0; }
        if (t1shift === void 0) { t1shift = 0; }
        if (t2shift === void 0) { t2shift = 0; }
        var baseItem = {
            type: 'providence',
            itemClass: 'basic',
            name: string_generator_1.StringGenerator.providence()
        };
        _.each(event_1.Event.t0stats, function (stat) {
            if (event_1.Event.chance.bool({ likelihood: 30 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-15, (-150 + t0shift) * multiplier),
                max: (150 + t0shift) * multiplier
            });
        });
        _.each(event_1.Event.t1stats, function (stat) {
            if (event_1.Event.chance.bool({ likelihood: 40 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-10, (-100 + t1shift) * multiplier),
                max: (100 + t1shift) * multiplier
            });
        });
        _.each(event_1.Event.t2stats, function (stat) {
            if (event_1.Event.chance.bool({ likelihood: 50 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-10, (-75 + t2shift) * multiplier),
                max: (75 + t2shift) * multiplier
            });
        });
        return new equipment_1.Equipment(baseItem);
    };
    Providence.doBasicProvidencing = function (player, provData) {
        var message = '';
        var xp = provData.xp, level = provData.level, gender = provData.gender, profession = provData.profession, gold = provData.gold;
        if (xp && event_1.Event.chance.bool({ likelihood: this.probabilities.xp })) {
            var curPlayerXp = player.xp;
            var lostXp = curPlayerXp - xp;
            player._xp.add(xp);
            message = message + " " + (xp > 0 ? 'Gained' : 'Lost') + " " + Math.abs(xp) + " xp!";
            if (xp < 0 && player._xp.atMinimum()) {
                message = message + " Lost 1 level!";
                player._level.sub(1);
                player.resetMaxXp();
                player._xp.set(player._xp.maximum + lostXp);
                player.emitLevelChange();
            }
        }
        else if (level && event_1.Event.chance.bool({ likelihood: this.probabilities.level })) {
            player._level.add(level);
            player.resetMaxXp();
            message = message + " " + (level > 0 ? 'Gained' : 'Lost') + " " + Math.abs(level) + " levels!";
            player.emitLevelChange();
        }
        if (player.gender !== gender && event_1.Event.chance.bool({ likelihood: this.probabilities.gender })) {
            player.gender = gender;
            message = message + " Gender is now " + gender + "!";
        }
        if (gold && event_1.Event.chance.bool({ likelihood: this.probabilities.gold })) {
            player.gold += gold;
            message = message + " " + (gold > 0 ? 'Gained' : 'Lost') + " " + Math.abs(gold) + " gold!";
        }
        if (profession !== player.professionName && event_1.Event.chance.bool({ likelihood: this.probabilities.profession })) {
            player.changeProfession(profession);
            message = message + " Profession is now " + profession + "!";
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.personality })) {
            _.each(player.$personalities.earnedPersonalities, function (_a) {
                var name = _a.name;
                if (name === 'Camping' || event_1.Event.chance.bool({ likelihood: 50 }))
                    return;
                player.$personalities.togglePersonality(player, name);
            });
            message = message + " Personality shift!";
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.title })) {
            player.changeTitle(_.sample(player.$achievements.titles()));
            message = message + " Title change!";
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.ilp })) {
            player.$premium.addIlp(5);
            message = message + " Got ILP!";
            player._updatePremium();
        }
        return message;
    };
    Providence.fatePoolProvidence = function (player, baseMessage) {
        var providenceData = {
            xp: event_1.Event.chance.integer({ min: -player._xp.maximum, max: player.level < 100 ? player._xp.maximum : 0 }),
            level: event_1.Event.chance.integer({ min: -3, max: player.level < 100 ? 2 : 0 }),
            gender: _.sample(this._genders),
            profession: _.sample(this._professions(player)) || 'Generalist',
            gold: event_1.Event.chance.integer({ min: -Math.min(30000, player.gold), max: 20000 })
        };
        baseMessage = baseMessage + " " + this.doBasicProvidencing(player, providenceData).trim();
        if (player.equipment.providence && event_1.Event.chance.bool({ likelihood: this.probabilities.clearProvidence })) {
            player.equipment.providence = null;
            delete player.equipment.providence;
            baseMessage = baseMessage + " Providence cleared!";
        }
        else if (!player.equipment.providence && event_1.Event.chance.bool({ likelihood: this.probabilities.newProvidence })) {
            player.equipment.providence = this.generateProvidenceItem(Math.round(player.level / 10));
        }
        player.recalculateStats();
        this.emitMessage({ affected: [player], eventText: baseMessage, category: adventure_log_1.MessageCategories.EXPLORE });
    };
    Providence.operateOn = function (player) {
        var eventText = this.eventText('providence', player);
        this.fatePoolProvidence(player, eventText);
        player.$statistics.batchIncrement(['Character.Events', 'Character.Event.Providence']);
    };
    return Providence;
}(event_1.Event));
Providence.WEIGHT = exports.WEIGHT;
Providence.probabilities = {
    xp: 10,
    level: 5,
    gender: 80,
    gold: 50,
    profession: 10,
    clearProvidence: 20,
    newProvidence: 75,
    personality: 50,
    title: 75,
    ilp: 1
};
Providence._genders = settings_1.SETTINGS.validGenders;
Providence._professions = function (player) {
    return _.keys(player.$statistics.getStat('Character.Professions')) || ['Generalist'];
};
exports.Providence = Providence;
