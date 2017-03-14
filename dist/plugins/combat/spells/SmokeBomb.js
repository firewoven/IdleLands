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
var DEXLoss_1 = require("../effects/DEXLoss");
var SmokeBomb = (function (_super) {
    __extends(SmokeBomb, _super);
    function SmokeBomb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SmokeBomb.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'DEXLoss');
    };
    SmokeBomb.prototype.determineTargets = function () {
        return this.$targetting.allEnemies;
    };
    SmokeBomb.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    SmokeBomb.prototype.calcPotency = function () {
        return 25 * this.spellPower;
    };
    SmokeBomb.prototype.preCast = function () {
        var _this = this;
        var message = '%player throws a %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DEXLoss_1.DEXLoss,
                targets: [target]
            });
        });
    };
    return SmokeBomb;
}(spell_1.Spell));
SmokeBomb.element = spell_1.SpellType.DEBUFF;
SmokeBomb.tiers = [
    { name: 'smoke bomb', spellPower: 1, weight: 25, cost: 100, profession: 'Archer', level: 5 },
    { name: 'smoke grenade', spellPower: 2, weight: 25, cost: 500, profession: 'Archer', level: 35 },
    { name: 'smoke missile', spellPower: 3, weight: 25, cost: 1500, profession: 'Archer', level: 85 }
];
exports.SmokeBomb = SmokeBomb;
