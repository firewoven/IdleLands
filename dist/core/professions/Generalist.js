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
var Generalist = (function (_super) {
    __extends(Generalist, _super);
    function Generalist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Generalist;
}(profession_1.Profession));
Generalist.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Generalist.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 18;
Generalist.baseMpPerInt = 18;
Generalist.baseConPerLevel = 3;
Generalist.baseDexPerLevel = 3;
Generalist.baseAgiPerLevel = 3;
Generalist.baseStrPerLevel = 3;
Generalist.baseIntPerLevel = 3;
Generalist.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.005; }
};
exports.Generalist = Generalist;
