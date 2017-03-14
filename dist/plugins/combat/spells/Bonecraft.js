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
var Bonecraft = (function (_super) {
    __extends(Bonecraft, _super);
    function Bonecraft() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bonecraft.shouldCast = function (caster) {
        return this.$canTarget.anyBonecraftable(caster);
    };
    Bonecraft.prototype.determineTargets = function () {
        return this.$targetting.randomBonecraftable;
    };
    Bonecraft.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = -Math.round(target._hp.maximum * _this.spellPower / 100);
            if (!target.$prevParty) {
                target.$prevParty = target.party;
            }
            target.party.playerLeave(target);
            _this.caster.party.playerJoin(target);
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return Bonecraft;
}(spell_1.Spell));
Bonecraft.element = spell_1.SpellType.HEAL;
Bonecraft.tiers = [
    { name: 'bonecraft', spellPower: 25, weight: 100, cost: 25000, level: 80, profession: 'Necromancer',
        collectibles: ['Necronomicon'] }
];
exports.Bonecraft = Bonecraft;
