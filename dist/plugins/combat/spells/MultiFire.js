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
var MultiFire = (function (_super) {
    __extends(MultiFire, _super);
    function MultiFire() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultiFire.shouldCast = function () {
        return this.$canTarget.yes();
    };
    MultiFire.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int * 0.5;
        var max = this.caster.liveStats.int * 0.8;
        return this.minMax(min, max);
    };
    MultiFire.prototype.determineTargets = function () {
        return this.$targetting.randomEnemies(this.spellPower);
    };
    MultiFire.prototype.preCast = function () {
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
    return MultiFire;
}(spell_1.Spell));
MultiFire.element = spell_1.SpellType.FIRE;
MultiFire.tiers = [
    { name: 'double fire', spellPower: 2, weight: 40, cost: 250, level: 25, profession: 'Mage' },
    { name: 'triple fire', spellPower: 3, weight: 40, cost: 750, level: 55, profession: 'Mage' },
    { name: 'quadruple fire', spellPower: 4, weight: 40, cost: 1250, level: 85, profession: 'Mage' },
    { name: 'fire star', spellPower: 5, weight: 40, cost: 1700, level: 185, profession: 'Mage',
        collectibles: ['Bucket of Lava'] }
];
exports.MultiFire = MultiFire;
