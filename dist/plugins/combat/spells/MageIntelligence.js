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
var INTBoost_1 = require("../effects/INTBoost");
var MageIntelligence = (function (_super) {
    __extends(MageIntelligence, _super);
    function MageIntelligence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MageIntelligence.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'INTBoost');
    };
    MageIntelligence.prototype.determineTargets = function () {
        return this.$targetting.randomAllyWithoutEffect('INTBoost');
    };
    MageIntelligence.prototype.calcDuration = function () {
        return 5;
    };
    MageIntelligence.prototype.calcPotency = function () {
        return this.spellPower;
    };
    MageIntelligence.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: INTBoost_1.INTBoost,
                targets: [target]
            });
        });
    };
    return MageIntelligence;
}(spell_1.Spell));
MageIntelligence.element = spell_1.SpellType.BUFF;
MageIntelligence.tiers = [
    { name: 'magic intelligence', spellPower: 15, weight: 25, cost: 200, profession: 'Mage', level: 15 },
    { name: 'magic brilliance', spellPower: 30, weight: 25, cost: 400, profession: 'Mage', level: 30 },
    { name: 'arcane intelligence', spellPower: 60, weight: 25, cost: 700, profession: 'Mage', level: 60 },
    { name: 'arcane brilliance', spellPower: 120, weight: 25, cost: 1100, profession: 'Mage', level: 95 }
];
exports.MageIntelligence = MageIntelligence;
