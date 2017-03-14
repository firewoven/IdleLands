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
var RestrictedNumber = require("restricted-number");
var profession_1 = require("../base/profession");
var Pirate = (function (_super) {
    __extends(Pirate, _super);
    function Pirate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pirate.setupSpecial = function (target) {
        target._special.name = 'Bottles';
        target._special.maximum = 99;
        target._special.toMaximum();
        target.$drunk = new RestrictedNumber(0, 100, 0);
    };
    Pirate.resetSpecial = function (target) {
        _super.resetSpecial.call(this, target);
        delete target.$drunk;
    };
    return Pirate;
}(profession_1.Profession));
Pirate.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 180;
Pirate.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Pirate.baseHpPerCon = 18;
Pirate.baseHpPerStr = 6;
Pirate.baseMpPerInt = 30;
Pirate.baseConPerLevel = 3;
Pirate.baseDexPerLevel = 2;
Pirate.baseAgiPerLevel = 2;
Pirate.baseStrPerLevel = 3;
Pirate.baseIntPerLevel = 1;
Pirate.classStats = {
    str: function (target, baseValue) { return target.$personalities && target.$personalities.isActive('Drunk') ? baseValue / 2 : 0; }
};
exports.Pirate = Pirate;
