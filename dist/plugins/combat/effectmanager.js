"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var EffectManager = (function () {
    function EffectManager() {
        this.effects = [];
    }
    EffectManager.prototype.hasEffect = function (effectName) {
        return _.some(this.effects, function (effect) { return effect.constructor.name === effectName; });
    };
    EffectManager.prototype.clear = function () {
        _.each(this.effects, function (effect) { return effect.duration = 0; });
        this.effects = [];
    };
    EffectManager.prototype.add = function (effect) {
        this.effects.push(effect);
    };
    EffectManager.prototype.remove = function (effect) {
        this.effects = _.without(this.effects, effect);
    };
    EffectManager.prototype.tick = function () {
        var _this = this;
        _.each(this.effects, function (effect) {
            if (effect.duration <= 0 || effect.target.hp === 0)
                return;
            effect.tick();
            if (effect.duration <= 0) {
                effect.unaffect();
                _this.remove(effect);
            }
        });
    };
    return EffectManager;
}());
exports.EffectManager = EffectManager;
