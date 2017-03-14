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
var Cleave = (function (_super) {
    __extends(Cleave, _super);
    function Cleave() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cleave.shouldCast = function (caster) {
        return caster._special.gtePercent(30);
    };
    Cleave.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Cleave.prototype.calcDamage = function () {
        var min = this.caster.liveStats.str * 2;
        var max = this.caster.liveStats.str * 3;
        return this.minMax(min, max) * this.spellPower;
    };
    Cleave.prototype.preCast = function () {
        var _this = this;
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        this.caster._special.toMinimum();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return Cleave;
}(spell_1.Spell));
Cleave.element = spell_1.SpellType.PHYSICAL;
Cleave.tiers = [
    { name: 'cleave', spellPower: 1, weight: 30, cost: 0, level: 50, profession: 'Barbarian' }
];
exports.Cleave = Cleave;
