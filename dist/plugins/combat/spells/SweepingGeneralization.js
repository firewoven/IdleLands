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
var SweepingGeneralization = (function (_super) {
    __extends(SweepingGeneralization, _super);
    function SweepingGeneralization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SweepingGeneralization.shouldCast = function (caster) {
        return this.$canTarget.moreThanOneEnemy(caster);
    };
    SweepingGeneralization.prototype.calcDamage = function () {
        var min = (this.caster.stats.str + this.caster.stats.dex) / 8;
        var max = (this.caster.stats.str + this.caster.stats.dex) / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    SweepingGeneralization.prototype.determineTargets = function () {
        return this.$targetting.allEnemies;
    };
    SweepingGeneralization.prototype.preCast = function () {
        var _this = this;
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        var damage = this.calcDamage();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return SweepingGeneralization;
}(spell_1.Spell));
SweepingGeneralization.element = spell_1.SpellType.PHYSICAL;
SweepingGeneralization.tiers = [
    { name: 'sweeping generalization', spellPower: 1.0, weight: 35, cost: 50, profession: 'Generalist', level: 5 },
    { name: 'broad generalization', spellPower: 3.0, weight: 35, cost: 500, profession: 'Generalist', level: 50 },
    { name: 'sweepo generalizo', spellPower: 0.8, weight: 35, cost: 300, profession: 'MagicalMonster', level: 15,
        collectibles: ['Generalist\'s Guidebook'] }
];
exports.SweepingGeneralization = SweepingGeneralization;
