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
var STRBoostValue_1 = require("../effects/STRBoostValue");
var INTBoostValue_1 = require("../effects/INTBoostValue");
var OurHeartsIgnite = (function (_super) {
    __extends(OurHeartsIgnite, _super);
    function OurHeartsIgnite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OurHeartsIgnite.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'INTBoostValue');
    };
    OurHeartsIgnite.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    OurHeartsIgnite.prototype.calcDuration = function () {
        return 3;
    };
    OurHeartsIgnite.prototype.calcPotency = function () {
        return this.spellPower;
    };
    OurHeartsIgnite.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: STRBoostValue_1.STRBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.str * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (STR)",
                targets: [target]
            });
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: '',
                applyEffect: INTBoostValue_1.INTBoostValue,
                applyEffectPotency: Math.max(1, Math.round(_this.caster.liveStats.int * _this.spellPower / 100)),
                applyEffectName: _this.tier.name + " (INT)",
                targets: [target]
            });
        });
    };
    return OurHeartsIgnite;
}(spell_1.Spell));
OurHeartsIgnite.element = spell_1.SpellType.BUFF;
OurHeartsIgnite.tiers = [
    { name: 'Our Hearts Ignite', spellPower: 15, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'Our Hearts Blaze', spellPower: 30, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.OurHeartsIgnite = OurHeartsIgnite;
