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
var EnergyMissile = (function (_super) {
    __extends(EnergyMissile, _super);
    function EnergyMissile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnergyMissile.shouldCast = function () {
        return this.$canTarget.yes();
    };
    EnergyMissile.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 4;
        var max = this.caster.liveStats.int / 2;
        return this.minMax(min, max) * this.spellPower;
    };
    EnergyMissile.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    EnergyMissile.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return EnergyMissile;
}(spell_1.Spell));
EnergyMissile.element = spell_1.SpellType.ENERGY;
EnergyMissile.tiers = [
    { name: 'energy missile', spellPower: 3, weight: 40, cost: 10, level: 1, profession: 'Mage' },
    { name: 'energy blast', spellPower: 5, weight: 40, cost: 450, level: 25, profession: 'Mage' },
    { name: 'astral flare', spellPower: 7, weight: 40, cost: 2300, level: 65, profession: 'Mage' },
    { name: 'energy prod', spellPower: 1, weight: 35, cost: 100, level: 15, profession: 'MagicalMonster',
        collectibles: ['Mage\'s Tome'] }
];
exports.EnergyMissile = EnergyMissile;
