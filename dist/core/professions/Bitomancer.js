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
var Bitomancer = (function (_super) {
    __extends(Bitomancer, _super);
    function Bitomancer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bitomancer.setupSpecial = function (target) {
        target._special.name = 'Bandwidth';
        target._special.maximum = Math.floor(56 * Math.pow(target.level, 2) / 50);
        target._special.toMaximum();
    };
    return Bitomancer;
}(profession_1.Profession));
Bitomancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 60;
Bitomancer.baseConPerLevel = 1;
Bitomancer.baseDexPerLevel = 3;
Bitomancer.baseAgiPerLevel = 1;
Bitomancer.baseStrPerLevel = 1;
Bitomancer.baseIntPerLevel = 7;
exports.Bitomancer = Bitomancer;
