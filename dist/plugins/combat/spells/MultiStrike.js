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
var spell_1 = require("../spell");
var MultiStrike = (function (_super) {
    __extends(MultiStrike, _super);
    function MultiStrike() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultiStrike.shouldCast = function () {
        return this.$canTarget.yes();
    };
    MultiStrike.prototype.preCast = function () {
        var message = '%player used %spellName!';
        _super.prototype.cast.call(this, {
            damage: 0,
            message: message,
            targets: []
        });
        for (var i = 0; i < this.spellPower; i++) {
            this.caster.$battle.doAttack(this.caster, 'Attack');
        }
    };
    return MultiStrike;
}(spell_1.Spell));
MultiStrike.element = spell_1.SpellType.PHYSICAL;
MultiStrike.tiers = [
    { name: 'double strike', spellPower: 2, weight: 40, cost: 100, level: 1, profession: 'Fighter' },
    { name: 'triple strike', spellPower: 3, weight: 40, cost: 1000, level: 50, profession: 'Fighter' },
    { name: 'double prod', spellPower: 2, weight: 35, cost: 1000, level: 15, profession: 'MagicalMonster',
        collectibles: ['Fighter\'s Manual'] }
];
exports.MultiStrike = MultiStrike;
