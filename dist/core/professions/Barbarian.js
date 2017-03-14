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
var profession_1 = require("../base/profession");
var Barbarian = (function (_super) {
    __extends(Barbarian, _super);
    function Barbarian() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Barbarian.setupSpecial = function (target) {
        target._special.name = 'Rage';
        target._special.set(0);
        target._special.maximum = 100;
        target.recalculateStats(['str']);
    };
    Barbarian.resetSpecial = function (target) {
        _super.resetSpecial.call(this, target);
        if (target.$dirty) {
            target.$dirty.flags.str = true;
        }
    };
    Barbarian._eventSelfAttacked = function (target) {
        target._special.add(5);
    };
    Barbarian._eventSelfAttack = function (target) {
        target._special.sub(2);
    };
    Barbarian._eventAllyKilled = function (target) {
        target._special.add(10);
    };
    Barbarian._eventSelfKilled = function (target) {
        target._special.toMinimum();
    };
    Barbarian._eventSelfKill = function (target) {
        target._special.sub(15);
    };
    return Barbarian;
}(profession_1.Profession));
Barbarian.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 210;
Barbarian.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 6;
Barbarian.baseHpPerStr = 18;
Barbarian.baseHpPerCon = 12;
Barbarian.baseConPerLevel = 6;
Barbarian.baseDexPerLevel = 1;
Barbarian.baseAgiPerLevel = 1;
Barbarian.baseStrPerLevel = 6;
Barbarian.baseIntPerLevel = -5;
Barbarian.classStats = {
    hpregen: function (target) { return target._hp.maximum * 0.01; },
    damageReduction: function (target) { return target.level * 10; },
    dex: function (target, baseValue) { return -baseValue * 0.5; },
    agi: function (target, baseValue) { return -baseValue * 0.5; },
    str: function (target, baseValue) { return baseValue * target.special / 100; }
};
exports.Barbarian = Barbarian;
