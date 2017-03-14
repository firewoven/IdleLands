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
var Fencer = (function (_super) {
    __extends(Fencer, _super);
    function Fencer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Fencer;
}(profession_1.Profession));
Fencer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Fencer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Fencer.baseHpPerCon = 1;
Fencer.baseHpPerDex = 10;
Fencer.baseConPerLevel = 1;
Fencer.baseDexPerLevel = 7;
Fencer.baseAgiPerLevel = 1;
Fencer.baseStrPerLevel = 1;
Fencer.baseIntPerLevel = 1;
Fencer.baseLukPerLevel = 1;
exports.Fencer = Fencer;
