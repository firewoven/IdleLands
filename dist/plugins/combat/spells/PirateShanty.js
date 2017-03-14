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
var DrunkenStupor_1 = require("../effects/DrunkenStupor");
var PirateShanty = (function (_super) {
    __extends(PirateShanty, _super);
    function PirateShanty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PirateShanty.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoost') && !caster.$effects.hasEffect('DrunkenStupor');
    };
    PirateShanty.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    PirateShanty.prototype.calcDuration = function () {
        return 6 - (3 - Math.floor(this.caster.special / 33));
    };
    PirateShanty.prototype.calcPotency = function () {
        return 20 + 3 * Math.floor(11 - this.caster.special / 9);
    };
    PirateShanty.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var message = '%player sings a %spellName with %targetName!';
            if (target.professionName === 'Pirate') {
                target.$drunk.add(spell_1.Spell.chance.integer({ min: 25, max: 45 }) + target.$personalities && target.$personalities.isActive('Drunk') ? 15 : 0);
                if (target.$drunk.atMaximum()) {
                    message = message + " %targetName is absolutely hammered!";
                    _super.prototype.cast.call(_this, {
                        damage: 0,
                        message: '',
                        applyEffect: DrunkenStupor_1.DrunkenStupor,
                        applyEffectName: 'drunken stupor',
                        applyEffectDuration: 4,
                        applyEffectPotency: 1,
                        targets: [target]
                    });
                }
            }
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: STRBoost_1.STRBoost,
                targets: [target]
            });
        });
    };
    return PirateShanty;
}(spell_1.Spell));
PirateShanty.description = 'Sings an inspirational sea shanty with an ally, increasing STR and drunkenness. STR boost scales on # of Bottles. The "DrunkenStupor" effect is gained when drunknness reaches 100%.';
PirateShanty.element = spell_1.SpellType.BUFF;
PirateShanty.stat = 'special';
PirateShanty.tiers = [
    { name: 'pirate shanty', spellPower: 1, weight: 25, cost: 18, profession: 'Pirate', level: 25 }
];
exports.PirateShanty = PirateShanty;
