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
var Prone_1 = require("../effects/Prone");
var BluntHit = (function (_super) {
    __extends(BluntHit, _super);
    function BluntHit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BluntHit.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'BluntHit');
    };
    BluntHit.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('BluntHit');
    };
    BluntHit.prototype.calcDamage = function () {
        var min = this.caster.liveStats.str / 6;
        var max = this.caster.liveStats.str / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    BluntHit.prototype.calcPotency = function () {
        return 100;
    };
    BluntHit.prototype.calcDuration = function () {
        return 1;
    };
    BluntHit.prototype.preCast = function () {
        var _this = this;
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                applyEffect: Prone_1.Prone,
                targets: [target]
            });
        });
    };
    return BluntHit;
}(spell_1.Spell));
BluntHit.element = spell_1.SpellType.PHYSICAL;
BluntHit.tiers = [
    { name: 'blunt hit', spellPower: 1, weight: 10, cost: 300, level: 15, profession: 'Fighter' }
];
exports.BluntHit = BluntHit;
