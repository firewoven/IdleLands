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
var STRBoost_1 = require("../effects/STRBoost");
var ClericStrength = (function (_super) {
    __extends(ClericStrength, _super);
    function ClericStrength() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClericStrength.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoost');
    };
    ClericStrength.prototype.determineTargets = function () {
        return this.$targetting.randomAllyWithoutEffect('STRBoost');
    };
    ClericStrength.prototype.calcDuration = function () {
        return 5;
    };
    ClericStrength.prototype.calcPotency = function () {
        return this.spellPower;
    };
    ClericStrength.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: STRBoost_1.STRBoost,
                targets: [target]
            });
        });
    };
    return ClericStrength;
}(spell_1.Spell));
ClericStrength.element = spell_1.SpellType.BUFF;
ClericStrength.tiers = [
    { name: 'boar strength', spellPower: 15, weight: 25, cost: 200, profession: 'Cleric', level: 15 },
    { name: 'demon strength', spellPower: 30, weight: 25, cost: 400, profession: 'Cleric', level: 30 },
    { name: 'dragon strength', spellPower: 60, weight: 25, cost: 700, profession: 'Cleric', level: 60 },
    { name: 'titan strength', spellPower: 120, weight: 25, cost: 1100, profession: 'Cleric', level: 95 }
];
exports.ClericStrength = ClericStrength;
