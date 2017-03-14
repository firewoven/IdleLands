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
var DEXBoostValue_1 = require("../effects/DEXBoostValue");
var AGIBoostValue_1 = require("../effects/AGIBoostValue");
var ThereIsNoEscape = (function (_super) {
    __extends(ThereIsNoEscape, _super);
    function ThereIsNoEscape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThereIsNoEscape.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DEXBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'AGIBoostValue');
    };
    ThereIsNoEscape.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    ThereIsNoEscape.prototype.calcDuration = function () {
        return 3;
    };
    ThereIsNoEscape.prototype.calcPotency = function () {
        return this.spellPower;
    };
    ThereIsNoEscape.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DEXBoostValue_1.DEXBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.dex * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (DEX)",
                targets: [target]
            });
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: '',
                applyEffect: AGIBoostValue_1.AGIBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.agi * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (AGI)",
                targets: [target]
            });
        });
    };
    return ThereIsNoEscape;
}(spell_1.Spell));
ThereIsNoEscape.element = spell_1.SpellType.BUFF;
ThereIsNoEscape.tiers = [
    { name: 'There Is No Escape', spellPower: 15, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'You Shant Get Away', spellPower: 30, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.ThereIsNoEscape = ThereIsNoEscape;
