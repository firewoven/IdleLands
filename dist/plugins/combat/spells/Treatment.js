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
var PercentageHPHeal_1 = require("../effects/PercentageHPHeal");
var Treatment = (function (_super) {
    __extends(Treatment, _super);
    function Treatment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Treatment.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
    };
    Treatment.prototype.determineTargets = function () {
        return this.$targetting.randomAllyWithoutEffect('PercentageHPHeal');
    };
    Treatment.prototype.calcDuration = function () {
        return 5;
    };
    Treatment.prototype.calcPotency = function () {
        return this.spellPower;
    };
    Treatment.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: PercentageHPHeal_1.PercentageHPHeal,
                targets: [target]
            });
        });
    };
    return Treatment;
}(spell_1.Spell));
Treatment.element = spell_1.SpellType.BUFF;
Treatment.tiers = [
    { name: 'treatment', spellPower: 5, weight: 25, cost: 300, profession: 'Generalist', level: 20 },
    { name: 'greater treatment', spellPower: 10, weight: 25, cost: 1200, profession: 'Generalist', level: 60 },
    { name: 'ultimate treatment', spellPower: 15, weight: 25, cost: 2700, profession: 'Generalist', level: 120,
        collectibles: ['Doctor\'s Floating Device'] }
];
exports.Treatment = Treatment;
