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
var Multishot = (function (_super) {
    __extends(Multishot, _super);
    function Multishot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Multishot.shouldCast = function () {
        return this.$canTarget.yes();
    };
    Multishot.prototype.calcDamage = function () {
        var min = this.caster.liveStats.dex * 0.25;
        var max = this.caster.liveStats.dex * 0.50;
        return this.minMax(min, max);
    };
    Multishot.prototype.determineTargets = function () {
        return this.$targetting.randomEnemies(this.spellPower);
    };
    Multishot.prototype.preCast = function () {
        var _this = this;
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
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
    return Multishot;
}(spell_1.Spell));
Multishot.element = spell_1.SpellType.PHYSICAL;
Multishot.stat = 'special';
Multishot.tiers = [
    { name: 'double shot', spellPower: 2, weight: 40, cost: 20, level: 25, profession: 'Archer' },
    { name: 'triple shot', spellPower: 3, weight: 40, cost: 30, level: 55, profession: 'Archer' },
    { name: 'quadruple shot', spellPower: 4, weight: 40, cost: 40, level: 85, profession: 'Archer' }
];
exports.Multishot = Multishot;
