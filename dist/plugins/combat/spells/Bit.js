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
var Bit = (function (_super) {
    __extends(Bit, _super);
    function Bit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bit.shouldCast = function () {
        return this.$canTarget.yes();
    };
    Bit.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 6;
        var max = this.caster.liveStats.int / 2;
        return this.minMax(min, max) * this.spellPower;
    };
    Bit.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Bit.prototype.preCast = function () {
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
    return Bit;
}(spell_1.Spell));
Bit.element = spell_1.SpellType.DIGITAL;
Bit.stat = 'special';
Bit.tiers = [
    { name: 'bit', spellPower: 1, weight: 40, cost: 1, level: 1, profession: 'Bitomancer' },
    { name: 'kilobit', spellPower: 2, weight: 40, cost: 16, level: 8, profession: 'Bitomancer' },
    { name: 'megabit', spellPower: 3, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'gigabit', spellPower: 4, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'terabit', spellPower: 5, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' },
    { name: 'petabit', spellPower: 6, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Steel Flower'] }
];
exports.Bit = Bit;
