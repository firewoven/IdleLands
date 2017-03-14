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
var FadeAway = (function (_super) {
    __extends(FadeAway, _super);
    function FadeAway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FadeAway.shouldCast = function (caster) {
        return caster._special.ltePercent(30);
    };
    FadeAway.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    FadeAway.prototype.calcDamage = function () {
        return this.spellPower;
    };
    FadeAway.prototype.preCast = function () {
        var _this = this;
        var restoredStamina = this.calcDamage();
        var message = "%player used %spellName and recovered " + restoredStamina + " stamina!";
        var targets = this.determineTargets();
        this.caster.$profession.resetSkillCombo(this.caster);
        this.caster._special.add(restoredStamina);
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                targets: [target]
            });
        });
    };
    return FadeAway;
}(spell_1.Spell));
FadeAway.element = spell_1.SpellType.PHYSICAL;
FadeAway.stat = 'special';
FadeAway.tiers = [
    { name: 'fade away', spellPower: 30, weight: 30, cost: 0, level: 10, profession: 'Rogue' },
    { name: 'shadowstep', spellPower: 50, weight: 30, cost: 0, level: 50, profession: 'Rogue' },
    { name: 'vanish from sight', spellPower: 70, weight: 30, cost: 0, level: 90, profession: 'Rogue' }
];
exports.FadeAway = FadeAway;
