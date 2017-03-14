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
var DamageReductionBoost_1 = require("../effects/DamageReductionBoost");
var EnergyWall = (function (_super) {
    __extends(EnergyWall, _super);
    function EnergyWall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnergyWall.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
    };
    EnergyWall.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    EnergyWall.prototype.calcDuration = function () {
        return 3;
    };
    EnergyWall.prototype.calcPotency = function () {
        return this.spellPower;
    };
    EnergyWall.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DamageReductionBoost_1.DamageReductionBoost,
                targets: [target]
            });
        });
    };
    return EnergyWall;
}(spell_1.Spell));
EnergyWall.element = spell_1.SpellType.BUFF;
EnergyWall.tiers = [
    { name: 'energy barrier', spellPower: 100, weight: 25, cost: 300, profession: 'Generalist', level: 15 },
    { name: 'energy barricade', spellPower: 300, weight: 25, cost: 1100, profession: 'Generalist', level: 45 },
    { name: 'energy wall', spellPower: 900, weight: 25, cost: 2500, profession: 'Generalist', level: 95 },
    { name: 'energy greatwall', spellPower: 4500, weight: 25, cost: 9000, profession: 'Generalist', level: 165,
        collectibles: ['Jar of Magic Dust'] }
];
exports.EnergyWall = EnergyWall;
