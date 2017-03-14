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
var Tranquility_1 = require("../effects/Tranquility");
var Tranquility = (function (_super) {
    __extends(Tranquility, _super);
    function Tranquility() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tranquility.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'Tranquility');
    };
    Tranquility.prototype.determineTargets = function () {
        // Tranquility is special and can target dead players.
        return this.$targetting.all;
    };
    Tranquility.prototype.calcDuration = function () {
        return 2;
    };
    Tranquility.prototype.calcPotency = function () {
        return this.spellPower;
    };
    Tranquility.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: Tranquility_1.Tranquility,
                targets: [target]
            });
        });
    };
    return Tranquility;
}(spell_1.Spell));
Tranquility.element = spell_1.SpellType.BUFF;
Tranquility.tiers = [
    { name: 'tranquility', spellPower: 1000000, weight: 25, cost: 10000, profession: 'Cleric', level: 75 }
];
exports.Tranquility = Tranquility;
