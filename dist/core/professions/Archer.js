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
var Archer = (function (_super) {
    __extends(Archer, _super);
    function Archer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Archer.setupSpecial = function (target) {
        target._special.name = 'Focus';
        target._special.maximum = 100 * (Math.floor(target.level / 100) + 1);
        target._special.set(Math.round(target._special.maximum / 2));
    };
    Archer._eventSelfAttacked = function (target) {
        target._special.sub(5);
    };
    Archer._eventSelfTakeTurn = function (target) {
        target._special.add(10);
    };
    return Archer;
}(profession_1.Profession));
Archer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 90;
Archer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Archer.baseHpPerCon = 18;
Archer.baseHpPerDex = 6;
Archer.baseMpPerDex = 18;
Archer.baseConPerLevel = 2;
Archer.baseDexPerLevel = 4;
Archer.baseAgiPerLevel = 3;
Archer.baseStrPerLevel = 2;
Archer.baseIntPerLevel = 1;
Archer.classStats = {
    dex: function (target, baseValue) { return baseValue * 0.25; },
    shatter: 1,
    crit: 10
};
exports.Archer = Archer;
