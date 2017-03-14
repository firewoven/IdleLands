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
var Cure = (function (_super) {
    __extends(Cure, _super);
    function Cure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cure.shouldCast = function (caster) {
        return this.$canTarget.allyBelowHealthPercent(caster, 80);
    };
    Cure.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 4;
        var max = this.caster.liveStats.int;
        return -this.minMax(min, max) * this.spellPower;
    };
    Cure.prototype.determineTargets = function () {
        return this.$targetting.randomAllyBelowHealthPercent(80);
    };
    Cure.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName and healed %healed hp!';
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
    return Cure;
}(spell_1.Spell));
Cure.element = spell_1.SpellType.HEAL;
Cure.tiers = [
    { name: 'cure', spellPower: 1.0, weight: 40, cost: 10, level: 1, profession: 'Cleric' },
    { name: 'heal', spellPower: 1.5, weight: 40, cost: 450, level: 25, profession: 'Cleric' },
    { name: 'restore', spellPower: 2.5, weight: 40, cost: 2300, level: 65, profession: 'Cleric' },
    { name: 'revitalize', spellPower: 5.5, weight: 40, cost: 7300, level: 115, profession: 'Cleric',
        collectibles: ['Strand of Fate'] },
    { name: 'mini cure', spellPower: 1.0, weight: 35, cost: 100, level: 15, profession: 'MagicalMonster',
        collectibles: ['Cleric\'s Text'] }
];
exports.Cure = Cure;
