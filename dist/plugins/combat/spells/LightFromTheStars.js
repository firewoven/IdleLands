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
var spell_1 = require("../spell");
var CONBoostValue_1 = require("../effects/CONBoostValue");
var LUKBoostValue_1 = require("../effects/LUKBoostValue");
var LightFromTheStars = (function (_super) {
    __extends(LightFromTheStars, _super);
    function LightFromTheStars() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LightFromTheStars.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'CONBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'LUKBoostValue');
    };
    LightFromTheStars.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    LightFromTheStars.prototype.calcDuration = function () {
        return 3;
    };
    LightFromTheStars.prototype.calcPotency = function () {
        return this.spellPower;
    };
    LightFromTheStars.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: CONBoostValue_1.CONBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.con * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (CON)",
                targets: [target]
            });
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: '',
                applyEffect: LUKBoostValue_1.LUKBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.luk * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (LUK)",
                targets: [target]
            });
        });
    };
    return LightFromTheStars;
}(spell_1.Spell));
LightFromTheStars.element = spell_1.SpellType.BUFF;
LightFromTheStars.tiers = [
    { name: 'Light From The Stars', spellPower: 15, weight: 25, cost: 200, profession: 'Bard', level: 1,
        collectibles: ['Soaked Sitar'] },
    { name: 'Purity From The Stars', spellPower: 30, weight: 25, cost: 2000, profession: 'Bard', level: 50,
        collectibles: ['Soaked Sitar'] }
];
exports.LightFromTheStars = LightFromTheStars;
