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
var MagicalMonster = (function (_super) {
    __extends(MagicalMonster, _super);
    function MagicalMonster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MagicalMonster;
}(profession_1.Profession));
MagicalMonster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
MagicalMonster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 75;
MagicalMonster.baseMpPerInt = 120;
MagicalMonster.baseConPerLevel = 2;
MagicalMonster.baseDexPerLevel = 2;
MagicalMonster.baseAgiPerLevel = 2;
MagicalMonster.baseStrPerLevel = 2;
MagicalMonster.baseIntPerLevel = 2;
exports.MagicalMonster = MagicalMonster;
