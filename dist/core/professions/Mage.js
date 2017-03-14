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
var Mage = (function (_super) {
    __extends(Mage, _super);
    function Mage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Mage;
}(profession_1.Profession));
Mage.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 150;
Mage.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 150;
Mage.baseMpPerInt = 42;
Mage.baseConPerLevel = 2;
Mage.baseDexPerLevel = 2;
Mage.baseAgiPerLevel = 2;
Mage.baseStrPerLevel = 2;
Mage.baseIntPerLevel = 6;
Mage.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.01; }
};
exports.Mage = Mage;
