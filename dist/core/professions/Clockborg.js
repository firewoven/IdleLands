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
var Clockborg = (function (_super) {
    __extends(Clockborg, _super);
    function Clockborg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Clockborg.setupSpecial = function (target) {
        target._special.name = 'Turrets';
        target._special.set(0);
        target._special.maximum = 3;
    };
    return Clockborg;
}(profession_1.Profession));
Clockborg.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 400;
Clockborg.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 10;
Clockborg.baseHpPerCon = 27;
Clockborg.baseMpPerInt = 27;
Clockborg.baseConPerLevel = 1;
Clockborg.baseDexPerLevel = 1;
Clockborg.baseAgiPerLevel = 1;
Clockborg.baseStrPerLevel = 6;
Clockborg.baseIntPerLevel = 6;
exports.Clockborg = Clockborg;
