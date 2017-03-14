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
var Berserk = (function (_super) {
    __extends(Berserk, _super);
    function Berserk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Berserk.shouldCast = function (caster) {
        return caster._special.lessThanPercent(75);
    };
    Berserk.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    Berserk.prototype.preCast = function () {
        var _this = this;
        var message = '%player is going %spellName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            target._special.add(_this.spellPower);
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                targets: [target]
            });
        });
    };
    return Berserk;
}(spell_1.Spell));
Berserk.description = 'A spell that increases Rage by a set amount.';
Berserk.element = spell_1.SpellType.PHYSICAL;
Berserk.tiers = [
    { name: 'berserk', spellPower: 15, weight: 25, cost: 0, profession: 'Barbarian', level: 1 },
    { name: 'crazy', spellPower: 20, weight: 25, cost: 0, profession: 'Barbarian', level: 35 },
    { name: 'out of control', spellPower: 25, weight: 25, cost: 0, profession: 'Barbarian', level: 75 }
];
exports.Berserk = Berserk;
