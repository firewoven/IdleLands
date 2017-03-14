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
var STRLoss_1 = require("../effects/STRLoss");
var DeathGlare = (function (_super) {
    __extends(DeathGlare, _super);
    function DeathGlare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeathGlare.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'STRLoss') && !caster.$effects.hasEffect('DrunkenStupor');
    };
    DeathGlare.prototype.determineTargets = function () {
        return this.$targetting.allEnemies;
    };
    DeathGlare.prototype.calcDuration = function () {
        return 4 - (3 - Math.floor(this.caster.special / 33));
    };
    DeathGlare.prototype.calcPotency = function () {
        return 20 + 3 * Math.floor(this.caster.special / 9);
    };
    DeathGlare.prototype.preCast = function () {
        var _this = this;
        var message = '%player shoots a %spellName at %targetName!';
        var targets = this.determineTargets();
        this.caster.$drunk.add(15);
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: STRLoss_1.STRLoss,
                targets: [target]
            });
        });
    };
    return DeathGlare;
}(spell_1.Spell));
DeathGlare.description = 'Glares at a target, reducing STR of the entire enemy team. Lasts up to 4 turns and reduces up to 50 STR based on # of bottles.';
DeathGlare.element = spell_1.SpellType.DEBUFF;
DeathGlare.stat = 'special';
DeathGlare.tiers = [
    { name: 'death glare', spellPower: 1, weight: 25, cost: 9, profession: 'Pirate', level: 7 }
];
exports.DeathGlare = DeathGlare;
