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
var Cleric = (function (_super) {
    __extends(Cleric, _super);
    function Cleric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cleric;
}(profession_1.Profession));
Cleric.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 60;
Cleric.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Cleric.baseMpPerInt = 30;
Cleric.baseConPerLevel = 4;
Cleric.baseDexPerLevel = 2;
Cleric.baseAgiPerLevel = 2;
Cleric.baseStrPerLevel = 3;
Cleric.baseIntPerLevel = 6;
Cleric.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.01; }
};
exports.Cleric = Cleric;
