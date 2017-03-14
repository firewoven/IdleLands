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
var PhysicalStatBoost_1 = require("../effects/PhysicalStatBoost");
var Fortify = (function (_super) {
    __extends(Fortify, _super);
    function Fortify() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fortify.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PhysicalStatBoost');
    };
    Fortify.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    Fortify.prototype.calcDuration = function () {
        return Math.floor(this.spellPower / 2);
    };
    Fortify.prototype.calcPotency = function () {
        return this.spellPower;
    };
    Fortify.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: PhysicalStatBoost_1.PhysicalStatBoost,
                targets: [target]
            });
        });
    };
    return Fortify;
}(spell_1.Spell));
Fortify.element = spell_1.SpellType.BUFF;
Fortify.tiers = [
    { name: 'fortify', spellPower: 10, weight: 25, cost: 200, profession: 'Generalist', level: 15 },
    { name: 'greater fortify', spellPower: 15, weight: 25, cost: 900, profession: 'Generalist', level: 45 },
    { name: 'ultimate fortify', spellPower: 20, weight: 25, cost: 2200, profession: 'Generalist', level: 90 }
];
exports.Fortify = Fortify;
