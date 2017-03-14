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
var Bard = (function (_super) {
    __extends(Bard, _super);
    function Bard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bard;
}(profession_1.Profession));
Bard.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 30;
Bard.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Bard.baseMpPerInt = 30;
Bard.baseConPerLevel = 1;
Bard.baseDexPerLevel = 1;
Bard.baseAgiPerLevel = 3;
Bard.baseStrPerLevel = 2;
Bard.baseIntPerLevel = 3;
Bard.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.005; }
};
exports.Bard = Bard;
