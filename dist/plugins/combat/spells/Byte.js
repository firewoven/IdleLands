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
var Byte = (function (_super) {
    __extends(Byte, _super);
    function Byte() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Byte.shouldCast = function () {
        return this.$canTarget.yes();
    };
    Byte.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 10;
        var max = this.caster.liveStats.int / 5;
        return this.minMax(min, max) * this.spellPower;
    };
    Byte.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Byte.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            var healed = Math.round(damage / 5);
            var message = "%player cast %spellName at %targetName and dealt %damage damage! %player gained " + healed + " hp!";
            _this.caster.$battle.healDamage(_this.caster, healed, target);
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return Byte;
}(spell_1.Spell));
Byte.element = spell_1.SpellType.DIGITAL;
Byte.stat = 'special';
Byte.tiers = [
    { name: 'byte', spellPower: 1, weight: 40, cost: 1, level: 1, profession: 'Bitomancer' },
    { name: 'kilobyte', spellPower: 2, weight: 40, cost: 16, level: 8, profession: 'Bitomancer' },
    { name: 'megabyte', spellPower: 3, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'gigabyte', spellPower: 4, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'terabyte', spellPower: 5, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' },
    { name: 'petabyte', spellPower: 6, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Giant Sized Flask'] }
];
exports.Byte = Byte;
