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
var Revive = (function (_super) {
    __extends(Revive, _super);
    function Revive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Revive.shouldCast = function (caster) {
        return this.$canTarget.anyAllyDead(caster);
    };
    Revive.prototype.determineTargets = function () {
        return this.$targetting.randomDeadAlly;
    };
    Revive.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = -Math.round(target._hp.maximum * _this.spellPower / 100);
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return Revive;
}(spell_1.Spell));
Revive.element = spell_1.SpellType.HEAL;
Revive.tiers = [
    { name: 'revive', spellPower: 25, weight: 100, cost: 500, level: 25, profession: 'Cleric' },
    { name: 'resurrect', spellPower: 50, weight: 100, cost: 1500, level: 65, profession: 'Cleric' }
];
exports.Revive = Revive;
