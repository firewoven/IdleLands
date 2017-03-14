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
var StillAngry_1 = require("../effects/StillAngry");
var Résumé = (function (_super) {
    __extends(Résumé, _super);
    function Résumé() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Résumé.shouldCast = function (caster) {
        return caster._hp.lessThanPercent(25) && this.$canTarget.enemyWithoutEffect(caster, 'StillAngry');
    };
    Résumé.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('StillAngry');
    };
    Résumé.prototype.calcDamage = function () {
        return 0;
    };
    Résumé.prototype.calcPotency = function () {
        return 100;
    };
    Résumé.prototype.calcDuration = function () {
        return 1;
    };
    Résumé.prototype.preCast = function () {
        var _this = this;
        var message = 'Out of desperation, %player gave a %spellName to %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var goldRequired = _this.caster.level * 100;
            var castOpts = {
                damage: 0,
                targets: [target]
            };
            if (target.gold > goldRequired) {
                message = message + " %targetName hired %player and gave %himher a part-time gig! [+" + goldRequired + " gold]";
                target.gainGold(-goldRequired, false);
                _this.caster.gainGold(goldRequired, false);
            }
            else {
                message = message + " %targetName declined, and got shoved into the ground by %player!";
                castOpts.applyEffect = StillAngry_1.StillAngry;
            }
            castOpts.message = message;
            _super.prototype.cast.call(_this, castOpts);
        });
    };
    return Résumé;
}(spell_1.Spell));
Résumé.element = spell_1.SpellType.PHYSICAL;
Résumé.tiers = [
    { name: 'résumé', spellPower: 1, weight: 30, cost: 10, level: 1, profession: 'SandwichArtist' }
];
exports.Résumé = Résumé;
