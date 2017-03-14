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
var DamageReductionBoost_1 = require("../effects/DamageReductionBoost");
var EnergyShield = (function (_super) {
    __extends(EnergyShield, _super);
    function EnergyShield() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnergyShield.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
    };
    EnergyShield.prototype.determineTargets = function () {
        return this.$targetting.randomAllyWithoutEffect('DamageReductionBoost');
    };
    EnergyShield.prototype.calcDuration = function () {
        return 5;
    };
    EnergyShield.prototype.calcPotency = function () {
        return this.spellPower;
    };
    EnergyShield.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DamageReductionBoost_1.DamageReductionBoost,
                targets: [target]
            });
        });
    };
    return EnergyShield;
}(spell_1.Spell));
EnergyShield.element = spell_1.SpellType.BUFF;
EnergyShield.tiers = [
    { name: 'energy shield', spellPower: 100, weight: 25, cost: 200, profession: 'Mage', level: 5 },
    { name: 'energy buckler', spellPower: 400, weight: 25, cost: 900, profession: 'Mage', level: 25 },
    { name: 'energy towershield', spellPower: 1000, weight: 25, cost: 2200, profession: 'Mage', level: 65 },
    { name: 'energy omegashield', spellPower: 5000, weight: 25, cost: 6000, profession: 'Mage', level: 125,
        collectibles: ['Jar of Magic Dust'] }
];
exports.EnergyShield = EnergyShield;
