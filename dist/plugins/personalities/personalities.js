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
var AllPersonalities = require("./personalities/_all");
var logger_1 = require("../../shared/logger");
var Personalities = (function () {
    function Personalities(container) {
        var _this = this;
        var PersonalitiesDb = require('./personalities.db.js').PersonalitiesDb;
        try {
            container.schedulePostConstructor(function (personalitiesDb) {
                _this.personalitiesDb = personalitiesDb;
            }, [PersonalitiesDb]);
        }
        catch (e) {
            logger_1.Logger.error('Personalities', e);
        }
    }
    // clear current variables and set new
    Personalities.prototype.init = function (opts) {
        this._id = undefined;
        this.activePersonalities = {};
        this.earnedPersonalities = [];
        _.extend(this, opts);
    };
    Personalities.prototype._allPersonalities = function (player) {
        return _(AllPersonalities)
            .values()
            .filter(function (ach) { return ach.hasEarned(player); })
            .value();
    };
    Personalities.prototype._activePersonalityData = function () {
        var _this = this;
        return _(this.earnedPersonalities)
            .filter(function (_a) {
            var name = _a.name;
            return _this.isActive(name);
        })
            .map(function (_a) {
            var name = _a.name;
            return AllPersonalities[name];
        })
            .value();
    };
    Personalities.prototype.turnAllOff = function (player) {
        var _this = this;
        _.each(_.keys(this.activePersonalities), function (pers) {
            if (!_this.activePersonalities[pers])
                return;
            _this.togglePersonality(player, pers);
        });
    };
    Personalities.prototype.togglePersonality = function (player, personality) {
        var newState = !this.activePersonalities[personality];
        this.activePersonalities[personality] = newState;
        if (newState) {
            AllPersonalities[personality].enable(player);
        }
        else {
            AllPersonalities[personality].disable(player);
        }
        this.save();
    };
    Personalities.prototype.isAnyActive = function (personalities) {
        var _this = this;
        return _.some(personalities, function (p) { return _this.isActive(p); });
    };
    Personalities.prototype.isActive = function (personality) {
        return this.activePersonalities[personality];
    };
    Personalities.prototype.checkPersonalities = function (player) {
        var earned = this._allPersonalities(player);
        var earnedObjs = _.sortBy(_.map(earned, function (pers) {
            return {
                name: pers.name,
                description: pers.description
            };
        }), 'name');
        this.earnedPersonalities = earnedObjs;
        // this.save(); - these are regenerated a lot, this is not really necessary except on toggle
        return earnedObjs;
    };
    Personalities.prototype.save = function () {
        this.personalitiesDb.savePersonalities(this);
    };
    return Personalities;
}());
Personalities = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Personalities);
exports.Personalities = Personalities;
