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
var CureGroup = (function (_super) {
    __extends(CureGroup, _super);
    function CureGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CureGroup.shouldCast = function (caster) {
        return this.$canTarget.allyBelow50PercentHealth(caster) && caster.party && caster.party.players.length > 1;
    };
    CureGroup.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int;
        var max = this.caster.liveStats.int * 2;
        return -this.minMax(min, max) * this.spellPower;
    };
    CureGroup.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    CureGroup.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName and healed %healed hp!';
        var targets = this.determineTargets();
        var totalHeal = this.calcDamage();
        var damage = totalHeal / this.caster.party.players.length;
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return CureGroup;
}(spell_1.Spell));
CureGroup.element = spell_1.SpellType.HEAL;
CureGroup.tiers = [
    { name: 'cure group', spellPower: 0.5, weight: 40, cost: 50, level: 30, profession: 'Cleric' },
    { name: 'heal group', spellPower: 1.0, weight: 40, cost: 5800, level: 55, profession: 'Cleric' },
    { name: 'restore group', spellPower: 1.5, weight: 40, cost: 13500, level: 95, profession: 'Cleric' },
    { name: 'revitalize group', spellPower: 2.5, weight: 40, cost: 30000, level: 145, profession: 'Cleric',
        collectibles: ['Gauntlet'] }
];
exports.CureGroup = CureGroup;
