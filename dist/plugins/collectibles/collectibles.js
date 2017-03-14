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
var logger_1 = require("../../shared/logger");
var game_state_1 = require("../../core/game-state");
var Collectibles = (function () {
    function Collectibles(container) {
        var _this = this;
        var CollectiblesDb = require('./collectibles.db').CollectiblesDb;
        try {
            container.schedulePostConstructor(function (collectiblesDb) {
                _this.collectiblesDb = collectiblesDb;
            }, [CollectiblesDb]);
        }
        catch (e) {
            logger_1.Logger.error('Collectibles', e);
        }
    }
    // clear current variables and set new
    Collectibles.prototype.init = function (opts) {
        this._id = undefined;
        this.collectibles = undefined;
        this.priorCollectibles = undefined;
        var allCollectibles = game_state_1.GameState.getInstance().world.allCollectibles;
        // update collectibles on login
        _.each(_.values(opts.collectibles), function (coll) {
            if (!allCollectibles[coll.name]) {
                delete opts.collectibles[coll.name];
                return;
            }
            coll.rarity = allCollectibles[coll.name].rarity || 'basic';
            coll.description = allCollectibles[coll.name].flavorText;
            coll.storyline = allCollectibles[coll.name].storyline;
        });
        _.extend(this, opts);
        if (_.isUndefined(this.uniqueCollectibles)) {
            this.save();
        }
    };
    Collectibles.prototype.calcUniqueCollectibles = function () {
        return _.uniq(_.keys(this.collectibles).concat(_.keys(this.priorCollectibles))).length;
    };
    Collectibles.prototype.reset = function () {
        var _this = this;
        if (!this.priorCollectibles)
            this.priorCollectibles = {};
        _.each(_.values(this.collectibles), function (coll) {
            _this.priorCollectibles[coll.name] = _this.priorCollectibles[coll.name] || 0;
            _this.priorCollectibles[coll.name]++;
        });
        this.collectibles = {};
    };
    Object.defineProperty(Collectibles.prototype, "priorCollectibleData", {
        get: function () {
            if (!this.priorCollectibles)
                return {};
            var allCollectibles = game_state_1.GameState.getInstance().world.allCollectibles;
            var emit = {};
            _.each(this.priorCollectibles, function (count, coll) {
                emit[coll] = _.cloneDeep(allCollectibles[coll]);
                if (!emit[coll])
                    return;
                emit[coll].name = coll;
                emit[coll].count = count;
                emit[coll].description = emit[coll].flavorText;
            });
            return emit;
        },
        enumerable: true,
        configurable: true
    });
    Collectibles.prototype.totalCollectibles = function () {
        return _.size(this.collectibles);
    };
    Collectibles.prototype.addCollectible = function (collectible) {
        this.collectibles[collectible.name] = collectible;
        this.save();
    };
    Collectibles.prototype.hasCollectible = function (collectibleName) {
        return this.collectibles[collectibleName];
    };
    Collectibles.prototype.save = function () {
        this.uniqueCollectibles = this.calcUniqueCollectibles();
        this.collectiblesDb.saveCollectibles(this);
    };
    return Collectibles;
}());
Collectibles = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Collectibles);
exports.Collectibles = Collectibles;
