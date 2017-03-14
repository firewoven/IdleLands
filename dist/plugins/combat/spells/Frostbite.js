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
var Frostbite_1 = require("../effects/Frostbite");
var Frostbite = (function (_super) {
    __extends(Frostbite, _super);
    function Frostbite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Frostbite.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Frostbite');
    };
    Frostbite.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('Frostbite');
    };
    Frostbite.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 4;
        var max = this.caster.liveStats.int / 3;
        return this.minMax(min, max) * this.spellPower;
    };
    Frostbite.prototype.calcPotency = function () {
        return this.spellPower * 25;
    };
    Frostbite.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    Frostbite.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                applyEffect: Frostbite_1.Frostbite,
                targets: [target]
            });
        });
    };
    return Frostbite;
}(spell_1.Spell));
Frostbite.element = spell_1.SpellType.ICE;
Frostbite.tiers = [
    { name: 'frostbite', spellPower: 1, weight: 40, cost: 300, level: 15, profession: 'Mage' },
    { name: 'cold snap', spellPower: 2, weight: 40, cost: 900, level: 65, profession: 'Mage' }
];
exports.Frostbite = Frostbite;
